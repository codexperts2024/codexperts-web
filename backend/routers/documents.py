import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response

router = APIRouter(prefix="/documents", tags=["documents"])

MAX_BYTES = 50 * 1024 * 1024

# Heroku apt buildpack installs packages under /app/.apt
APT_ROOT = Path(os.environ.get("APT_ROOT", "/app/.apt"))


def resolve_soffice() -> str:
    candidates = [
        os.environ.get("LIBREOFFICE_PATH"),
        str(APT_ROOT / "usr/bin/soffice"),
        str(APT_ROOT / "usr/lib/libreoffice/program/soffice"),
        "/usr/bin/soffice",
        "soffice",
    ]
    for candidate in candidates:
        if not candidate:
            continue
        if Path(candidate).is_file() or shutil.which(candidate):
            return candidate
    return "soffice"


def libreoffice_env() -> dict:
    """Build env so Heroku apt LibreOffice can find libreglo.so and friends."""
    env = os.environ.copy()
    lib_paths = [
        str(APT_ROOT / "usr/lib/libreoffice/program"),
        str(APT_ROOT / "usr/lib/x86_64-linux-gnu"),
        str(APT_ROOT / "lib/x86_64-linux-gnu"),
        str(APT_ROOT / "usr/lib"),
        str(APT_ROOT / "lib"),
        "/usr/lib/libreoffice/program",
        "/usr/lib/x86_64-linux-gnu",
        "/usr/lib",
    ]
    existing = [p for p in env.get("LD_LIBRARY_PATH", "").split(":") if p]
    env["LD_LIBRARY_PATH"] = ":".join([*lib_paths, *existing])

    path_prefix = [
        str(APT_ROOT / "usr/bin"),
        str(APT_ROOT / "usr/lib/libreoffice/program"),
    ]
    env["PATH"] = ":".join([*path_prefix, env.get("PATH", "")])

    # LibreOffice needs a writable home and headless VCL plugin on servers.
    env["HOME"] = env.get("HOME") if env.get("HOME") and env["HOME"] != "/" else "/tmp"
    env.setdefault("SAL_USE_VCLPLUGIN", "svp")
    env.setdefault("PYTHONPATH", "")
    return env


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
                    "pdf",
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
            if "libreglo.so" in stderr or "shared libraries" in stderr:
                detail = (
                    "DOCX to PDF conversion failed: LibreOffice libraries are missing on the server. "
                    "Redeploy the backend with the apt buildpack and updated Aptfile."
                )
            else:
                detail = "DOCX to PDF conversion failed. Try uploading a PDF instead."
            raise HTTPException(status_code=500, detail=detail) from exc
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
