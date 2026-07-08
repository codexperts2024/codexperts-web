import logging
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response

router = APIRouter(prefix="/documents", tags=["documents"])
logger = logging.getLogger(__name__)

MAX_BYTES = 50 * 1024 * 1024


def resolve_soffice() -> str:
    if os.environ.get("LIBREOFFICE_PATH"):
        return os.environ["LIBREOFFICE_PATH"]

    which = shutil.which("soffice")
    if which:
        return which

    vendor_root = Path(os.environ.get("HOME", "/app")) / "vendor/libreoffice/opt"
    if vendor_root.is_dir():
        for opt_dir in sorted(vendor_root.iterdir(), reverse=True):
            candidate = opt_dir / "program/soffice"
            if candidate.is_file():
                return str(candidate)

    return "soffice"


def libreoffice_env() -> dict:
    env = os.environ.copy()
    env["HOME"] = env.get("HOME") if env.get("HOME") and env["HOME"] != "/" else "/tmp"
    env.setdefault("SAL_USE_VCLPLUGIN", "svp")
    return env


def conversion_error_detail(stderr: str) -> str:
    if "libreglo.so" in stderr or "shared libraries" in stderr:
        return (
            "DOCX to PDF conversion failed: LibreOffice libraries are missing on the server. "
            "Redeploy the backend with the LibreOffice AppImage buildpack."
        )
    if "DeploymentException" in stderr or "uno" in stderr.lower():
        return (
            "DOCX to PDF conversion failed: LibreOffice is misconfigured on the server. "
            "Use the LibreOffice AppImage buildpack on Heroku-24."
        )
    return "DOCX to PDF conversion failed. Try uploading a PDF instead."


@router.post("/convert/docx-to-pdf")
async def convert_docx_to_pdf(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail="Only .docx files are supported.")

    raw = await file.read()
    if len(raw) > MAX_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds the 50 MB limit.")
    if not raw:
        raise HTTPException(status_code=400, detail="Empty file.")

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        input_path = tmp_path / "input.docx"
        input_path.write_bytes(raw)
        user_install = tmp_path / "lo-profile"
        user_install.mkdir()

        soffice = resolve_soffice()
        env = libreoffice_env()

        try:
            subprocess.run(
                [
                    soffice,
                    "--headless",
                    "--nologo",
                    "--nofirststartwizard",
                    "--norestore",
                    f"-env:UserInstallation=file://{user_install}",
                    "--convert-to",
                    "pdf:writer_pdf_Export:{\"EmbedStandardFonts\":{\"type\":\"boolean\",\"value\":\"true\"},\"UseTaggedPDF\":{\"type\":\"boolean\",\"value\":\"false\"}}",
                    "--outdir",
                    str(tmp_path),
                    str(input_path),
                ],
                check=True,
                capture_output=True,
                timeout=120,
                env=env,
            )
        except FileNotFoundError as exc:
            raise HTTPException(
                status_code=503,
                detail="Document converter is not available on the server.",
            ) from exc
        except subprocess.CalledProcessError as exc:
            stderr = (exc.stderr or b"").decode("utf-8", errors="ignore")
            stdout = (exc.stdout or b"").decode("utf-8", errors="ignore")
            logger.error(
                "soffice conversion failed (binary=%s): stderr=%s stdout=%s",
                soffice,
                stderr[:2000],
                stdout[:500],
            )
            raise HTTPException(status_code=500, detail=conversion_error_detail(stderr)) from exc
        except subprocess.TimeoutExpired as exc:
            raise HTTPException(status_code=504, detail="Conversion timed out.") from exc

        pdf_path = tmp_path / "input.pdf"
        if not pdf_path.exists():
            raise HTTPException(status_code=500, detail="Conversion produced no PDF output.")

        pdf_bytes = pdf_path.read_bytes()
        output_name = Path(file.filename).with_suffix(".pdf").name

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'inline; filename="{output_name}"'},
        )
