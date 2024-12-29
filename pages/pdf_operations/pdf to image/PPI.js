let zip = new JSZip();
let zipFileName = 'images.zip'; // Default zip file name
let imageCount = 0; // Count of images to track the download button visibility

document.getElementById('convertButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert('Please select a PDF file.');
        return;
    }

    const file = fileInput.files[0];
    const fileReader = new FileReader();
    fileReader.onload = async function () {
        const pdfData = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(pdfData).promise;

        // Clear any existing canvases and reset zip
        const canvasContainer = document.getElementById('canvasContainer');
        canvasContainer.innerHTML = '';
        zip = new JSZip();
        imageCount = 0;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const scale = 0.5; // Adjust scale for smaller images
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.className = 'canvas';
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render PDF page into canvas context
            await page.render({ canvasContext: context, viewport }).promise;

            // Create a wrapper for each canvas and download link
            const canvasWrapper = document.createElement('div');
            canvasWrapper.className = 'canvas-wrapper';

            // Add canvas to the wrapper
            canvasWrapper.appendChild(canvas);

            // Create a download link for each image
            const imgData = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.href = imgData;
            downloadLink.download = `converted_image_page_${pageNum}.png`;
            downloadLink.innerText = `Download Page ${pageNum}`;
            downloadLink.className = 'downloadLink';
            
            // Add download link to the wrapper
            canvasWrapper.appendChild(downloadLink);

            // Add wrapper to the container
            canvasContainer.appendChild(canvasWrapper);

            // Add image data to zip
            const imgBlob = await fetch(imgData).then(res => res.blob());
            zip.file(`converted_image_page_${pageNum}.png`, imgBlob);

            imageCount++;
        }

        // Show the ZIP download button if images are created
        const zipButton = document.getElementById('zipButton');
        if (imageCount > 0) {
            zipButton.style.display = 'inline';
        }
    };

    fileReader.readAsArrayBuffer(file);
});

document.getElementById('zipButton').addEventListener('click', async () => {
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
});