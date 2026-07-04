import subprocess
import tempfile
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response

router = APIRouter(prefix="/documents", tags=["documents"])

MAX_BYTES = 50 * 1024 * 1024


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

        try:
            subprocess.run(
                [
                    "soffice",
                    "--headless",
                    "--nologo",
                    "--nofirststartwizard",
                    "--convert-to",
                    "pdf",
                    "--outdir",
                    str(tmp_path),
                    str(input_path),
                ],
                check=True,
                capture_output=True,
                timeout=120,
            )
        except FileNotFoundError as exc:
            raise HTTPException(
                status_code=503,
                detail="Document converter is not available on the server.",
            ) from exc
        except subprocess.CalledProcessError as exc:
            stderr = (exc.stderr or b"").decode("utf-8", errors="ignore")
            raise HTTPException(
                status_code=500,
                detail=f"DOCX to PDF conversion failed. {stderr[:200]}".strip(),
            ) from exc
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
