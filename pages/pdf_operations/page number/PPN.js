const uploadInput = document.getElementById("pdf-upload");
const addPageNumbersBtn = document.getElementById("add-page-numbers");
const downloadBtn = document.getElementById("download-btn");
const preview = document.getElementById("preview");
const positionSelect = document.getElementById("position");

let pdfBytes;

uploadInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    pdfBytes = await file.arrayBuffer();
    addPageNumbersBtn.disabled = false;
  }
});

addPageNumbersBtn.addEventListener("click", async () => {
  if (!pdfBytes) return;

  const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
  const position = positionSelect.value;

  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const pageNumber = index + 1;
    let x, y;

    if (position === "footer-center") {
      x = width / 2 - 30;
      y = 20;
    } else if (position === "footer-left") {
      x = 20;
      y = 20;
    } else if (position === "footer-right") {
      x = width - 60;
      y = 20;
    }

    page.drawText(`Page ${pageNumber}`, {
      x,
      y,
      size: 12,
      font,
      color: PDFLib.rgb(0, 0, 1),
    });
  });

  const modifiedPdfBytes = await pdfDoc.save();
  const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);
  preview.src = url;
  preview.hidden = false;
  downloadBtn.hidden = false;
  downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "Modified_PDF.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  uploadInput.closest("div").hidden = true;
  addPageNumbersBtn.disabled = true;
});