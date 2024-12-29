const customCompressionToggle = document.getElementById('customCompressionToggle');
const customCompressionSection = document.getElementById('customCompressionSection');
const generateButton = document.getElementById('generateButton');
let selectedFile;

// Toggle visibility of custom compression input
customCompressionToggle.addEventListener('change', function () {
    if (this.checked) {
        customCompressionSection.style.display = 'block';
    } else {
        customCompressionSection.style.display = 'none';
    }
});

// Show Generate Button when image is selected
document.getElementById('imageInput').addEventListener('change', function(event) {
    selectedFile = event.target.files[0];
    if (selectedFile) {
        generateButton.style.display = 'inline-block';  // Show the Generate Button
    }
});

// Handle Generate Button click
generateButton.addEventListener('click', function() {
    if (selectedFile) {
        // Display original file size in KB
        document.getElementById('originalSize').textContent = (selectedFile.size / 1024).toFixed(2);

        const reader = new FileReader();
        reader.onload = function(e) {
            // Display original image
            const originalImage = document.getElementById('originalImage');
            originalImage.src = e.target.result;
            originalImage.style.display = 'block';  // Show the original image

            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');

                // Set canvas width and height for resizing
                const max_width = 800;
                const scaleSize = max_width / img.width;
                canvas.width = max_width;
                canvas.height = img.height * scaleSize;

                // Draw the image in the canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                let compressedDataUrl;
                if (customCompressionToggle.checked) {
                    // Custom compression logic based on user-specified KB
                    const targetSizeKB = parseFloat(document.getElementById('customSize').value) || 500;
                    const quality = getCompressionQuality(selectedFile.size / 1024, targetSizeKB);
                    compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                } else {
                    // Default compression (70% quality)
                    compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                }

                // Convert base64 string to byte size for compressed image
                const stringLength = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
                const compressedSizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;

                // Display compressed file size in KB
                document.getElementById('compressedSize').textContent = (compressedSizeInBytes / 1024).toFixed(2);

                // Display the compressed image
                const compressedImage = document.getElementById('compressedImage');
                compressedImage.src = compressedDataUrl;

                // Enable and set download button
                const downloadButton = document.getElementById('downloadButton');
                downloadButton.href = compressedDataUrl;
                downloadButton.style.display = 'inline-block';  // Show the download button
            }
        };
        reader.readAsDataURL(selectedFile);
    }
});

// Function to calculate the compression quality based on the target size
function getCompressionQuality(originalSizeKB, targetSizeKB) {
    const quality = targetSizeKB / originalSizeKB;
    return Math.min(Math.max(quality, 0.1), 1); // Clamp between 0.1 and 1 to prevent over-compression
}