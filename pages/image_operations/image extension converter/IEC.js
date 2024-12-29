const fileInput = document.getElementById('fileInput');
const formatSelect = document.getElementById('formatSelect');
const convertButton = document.getElementById('convertButton');
const output = document.getElementById('output');

convertButton.addEventListener('click', async () => {
    const files = fileInput.files;
    const format = formatSelect.value;

    if (files.length === 0) {
        alert("Please select an image file!");
        return;
    }

    output.innerHTML = '';  // Clear previous output

    const promises = Array.from(files).map(file => convertImage(file, format));
    const results = await Promise.all(promises);

    results.forEach(({ url, downloadName, size, dimensions }) => {
        const imageCard = document.createElement('div');
        imageCard.classList.add('image-card');

        const imagePreview = document.createElement('img');
        imagePreview.src = url;
        imagePreview.classList.add('image-preview');

        const info = document.createElement('div');
        info.classList.add('info');
        info.textContent = `Extension: .${format} | Size: ${size} | Dimensions: ${dimensions.width}x${dimensions.height}px`;

        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = downloadName;
        downloadLink.classList.add('download-btn');
        downloadLink.textContent = 'Download';

        imageCard.appendChild(imagePreview);
        imageCard.appendChild(info);
        imageCard.appendChild(downloadLink);
        output.appendChild(imageCard);
    });
});

async function convertImage(file, format) {
    const url = await loadImage(file);
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;

        img.onload = function () {
            requestAnimationFrame(() => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    const sizeInKB = blob.size / 1024;
                    const size = sizeInKB > 1024
                        ? `${(sizeInKB / 1024).toFixed(2)} MB`
                        : `${sizeInKB.toFixed(2)} KB`;
                    const dimensions = { width: img.width, height: img.height };
                    const url = URL.createObjectURL(blob);
                    const downloadName = file.name.replace(/\.[^/.]+$/, "") + '.' + format;
                    resolve({ url, downloadName, size, dimensions });
                }, `image/${format}`);
            });
        };
    });
}

function loadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}