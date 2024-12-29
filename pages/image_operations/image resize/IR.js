document.getElementById("uploadForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("uploadImage");
    const widthInput = document.getElementById("width").value;
    const heightInput = document.getElementById("height").value;

    if (fileInput.files.length === 0) {
        alert("Please upload an image.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        // Display the original image
        const originalImage = document.getElementById("originalImage");
        originalImage.src = img.src;

        // Display the original image file name
        const originalImageName = document.getElementById("originalImageName");
        originalImageName.textContent = "Original File: " + file.name;

        // Calculate and display the original image size in KB
        const originalImageSize = (file.size / 1024).toFixed(2) + " KB";
        document.getElementById("originalImageSize").textContent = "Size: " + originalImageSize;

        img.onload = function () {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            // Enable high-quality resizing
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";

            // Maintain aspect ratio if only one dimension is provided
            const aspectRatio = img.width / img.height;
            let newWidth = widthInput ? widthInput : img.width;
            let newHeight = heightInput ? heightInput : img.height;

            if (!widthInput && heightInput) {
                newWidth = heightInput * aspectRatio;
            } else if (!heightInput && widthInput) {
                newHeight = widthInput / aspectRatio;
            }

            // Set canvas width and height
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw the resized image on the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Determine the output format (JPEG for non-transparent images, PNG for transparent images)
            let outputFormat = file.type === "image/png" ? "image/png" : "image/jpeg";
            let resizedImageURL = canvas.toDataURL(outputFormat, 1.0);  // "1.0" ensures maximum image quality

            // Show the resized image in the output div
            const resizedImage = document.getElementById("resizedImage");
            resizedImage.src = resizedImageURL;

            // Provide the download link for the resized image
            const downloadLink = document.getElementById("downloadLink");
            downloadLink.href = resizedImageURL;
            downloadLink.download = "resized-" + file.name;  // Append "resized-" to the file name for the resized image
            downloadLink.textContent = "Download Resized Image";
            downloadLink.classList.remove("hidden");

            // Calculate and display the resized image size
            const resizedImageSize = (resizedImageURL.length * 0.75 / 1024).toFixed(2) + " KB"; // Base64 string length * 0.75 to estimate size
            document.getElementById("resizedImageSize").textContent = "Size: " + resizedImageSize;

            // Show the output section
            document.getElementById("output").style.display = "block";
        };
    };

    reader.readAsDataURL(file);
});