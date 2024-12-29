function generateQRCode() {
  const qrText = document.getElementById('qrText').value;
  const qrCodeContainer = document.getElementById('qrCodeContainer');
  const downloadButton = document.getElementById('downloadButton');

  if (!qrText) {
      alert("Please enter text or URL to generate QR code");
      return;
  }

  qrCodeContainer.innerHTML = ''; // Clear previous QR code
  downloadButton.style.display = 'none'; // Hide download button initially

  const containerWidth = qrCodeContainer.offsetWidth; // Get container's width

  // Generate QR code with dynamic size
  QRCode.toDataURL(qrText, {
      width: containerWidth, // Set width dynamically
      height: containerWidth, // Keep square shape
      color: { dark: '#000000', light: '#ffffff' }
  }, function (error, url) {
      if (error) {
          console.error(error);
      } else {
          const img = document.createElement('img');
          img.src = url;
          img.style.width = '100%'; // Responsive width
          img.style.height = 'auto'; // Maintain aspect ratio
          qrCodeContainer.appendChild(img); // Display the generated QR code image

          // Update the download button with the QR code URL
          downloadButton.href = url;
          downloadButton.download = 'qrcode.png';
          downloadButton.style.display = 'inline-block'; // Show the download button
      }
  });
}
