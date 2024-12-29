let uploadedImage = null;

    document.getElementById("uploadImage").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage = new Image();
                uploadedImage.onload = function() {
                    // Reset canvas size
                    const canvas = document.getElementById("canvas");
                    canvas.width = uploadedImage.width;
                    canvas.height = uploadedImage.height;
                };
                uploadedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    function addWatermark() {
        if (!uploadedImage) {
            alert("Please upload an image first!");
            return;
        }

        const watermarkText = document.getElementById("watermarkText").value || "Your Watermark";
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        // Draw the uploaded image onto the canvas
        ctx.drawImage(uploadedImage, 0, 0);

        // Set watermark text properties
        ctx.font = "40px Arial";
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";  // Very light black color with high transparency
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Define diagonal properties (right to left)
        const angle = -Math.PI / 4; // 45 degrees (right to left diagonal)
        
        // Set the space between watermarks vertically and horizontally
        const space = 200; // Adjust space to control watermark density

        // Loop to draw multiple watermark lines diagonally across the image (from right to left)
        for (let x = canvas.width; x >= -canvas.width / 2; x -= space) {
            for (let y = canvas.height; y >= -canvas.height / 2; y -= space) {
                ctx.save();
                
                // Move to the current x, y position
                ctx.translate(x, y);
                
                // Rotate to create the diagonal effect (right to left)
                ctx.rotate(angle);
                
                // Draw the watermark text
                ctx.fillText(watermarkText, 0, 0);
                
                // Restore the context to avoid affecting other drawings
                ctx.restore();
            }
        }

        // Show the download link
        const downloadLink = document.getElementById("downloadLink");
        downloadLink.style.display = "inline";

        // Create downloadable image from the canvas
        downloadLink.href = canvas.toDataURL("image/png");
    }