// Function to toggle the visibility of the watermark input
document.getElementById('includeWatermark').addEventListener('change', function () {
    const watermarkContainer = document.getElementById('watermarkContainer');
    watermarkContainer.style.display = this.checked ? 'block' : 'none'; // Show/hide watermark input
});

// Generate PDF button click event
document.getElementById('generatePdf').addEventListener('click', async function () {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", putOnlyUsedFonts: true });
    const watermarkText = document.getElementById('watermark').value || 'Watermark'; // Get watermark text
    const includeWatermark = document.getElementById('includeWatermark').checked; // Check if watermark is included
    const includePageNumber = document.getElementById('includePageNumber').checked; // Check if page number is included

    const files = document.getElementById('imageInput').files;
    const totalFiles = files.length;

    if (totalFiles === 0) {
        alert("Please select at least one image.");
        return;
    }

    const marginTop = 20;  // Top margin in mm
    const marginBottom = 20; // Bottom margin in mm
    const marginLeft = 10;  // Left margin in mm
    const marginRight = 10; // Right margin in mm
    const pageWidth = 210;  // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const contentWidth = pageWidth - marginLeft - marginRight; // Width available for content
    const contentHeight = pageHeight - marginTop - marginBottom; // Height available for content

    for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const imgData = await readFile(file);

        const img = new Image();
        img.src = imgData;

        img.onload = () => {
            let imgWidth = img.width;
            let imgHeight = img.height;

            // Resize image to fit within the available space on the page
            const aspectRatio = imgWidth / imgHeight;
            if (imgWidth > contentWidth || imgHeight > contentHeight) {
                if (imgWidth > imgHeight) {
                    imgWidth = contentWidth; // Fit image width to content area
                    imgHeight = imgWidth / aspectRatio; // Maintain aspect ratio
                } else {
                    imgHeight = contentHeight; // Fit image height to content area
                    imgWidth = imgHeight * aspectRatio; // Maintain aspect ratio
                }
            }

            // Calculate position to center the image on the page (taking margins into account)
            const centerX = marginLeft + (contentWidth - imgWidth) / 2;
            const centerY = marginTop + (contentHeight - imgHeight) / 2;

            // Add image to PDF (centered within the page)
            pdf.addImage(imgData, 'JPEG', centerX, centerY, imgWidth, imgHeight);

            // Add watermark if checked
            if (includeWatermark) {
                pdf.setTextColor(180); // Set watermark color to a lighter shade
                pdf.setFontSize(15); // Set font size for watermark
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const opacity = 0.2;
                pdf.setGState(new window.jspdf.GState({ opacity }));

                // Draw the watermark in a repeating diagonal pattern
                const spacing = 60; // Distance between watermarks
                for (let x = -50; x < pageWidth; x += spacing) {
                    for (let y = 50; y < pageHeight; y += spacing) {
                        pdf.text(watermarkText, x, y, { align: 'center', angle: -45 }); // Rotate text for diagonal effect
                    }
                }
            }

            // Add page number at the bottom center if checked
            if (includePageNumber) {
                const pageNumber = i + 1; // Pages start at 1
                pdf.setFontSize(12);
                pdf.text(`  ${pageNumber}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });
            }

            // If not the last image, add a new page
            if (i < totalFiles - 1) {
                pdf.addPage();
            }

            // Save the PDF to a Blob
            const pdfBlob = pdf.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            const downloadLink = document.getElementById('pdfDownload');
            downloadLink.href = url;
            downloadLink.style.display = 'block'; // Show download button
        };
    }
});

// Function to read file as Data URL
function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result);
        };
        reader.onerror = function () {
            reject(new Error("File reading error"));
        };
        reader.readAsDataURL(file);
    });
}

// Refresh button click event
document.getElementById('refresh').addEventListener('click', function () {
    document.getElementById('imageInput').value = ''; // Clear file input
    document.getElementById('pdfDownload').style.display = 'none'; // Hide download link
    document.getElementById('watermark').value = ''; // Clear watermark input
    document.getElementById('includeWatermark').checked = false; // Reset watermark checkbox to off
    document.getElementById('includePageNumber').checked = false; // Reset page number checkbox to off
    document.getElementById('watermarkContainer').style.display = 'none'; // Reset watermark text input visibility
});
