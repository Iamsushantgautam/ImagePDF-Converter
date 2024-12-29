import { PDFDocument } from 'https://cdn.skypack.dev/pdf-lib';

        document.getElementById('mergeButton').addEventListener('click', async () => {
            const inputFiles = document.getElementById('pdfFiles').files;
            if (inputFiles.length < 2) {
                alert('Please select at least two PDF files to merge.');
                return;
            }

            const mergedPdf = await PDFDocument.create();
            for (let file of inputFiles) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'merged.pdf';
            downloadLink.textContent = 'Download Merged PDF';
            document.getElementById('output').innerHTML = '';
            document.getElementById('output').appendChild(downloadLink);
        });