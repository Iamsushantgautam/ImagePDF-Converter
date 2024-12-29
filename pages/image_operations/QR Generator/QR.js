function generateQRCode() {
    const qrText = document.getElementById('qrText').value;
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    
    if (!qrText) {
      alert("Please enter text or URL to generate QR code");
      return;
    }

    qrCodeContainer.innerHTML = ''; // Clear previous QR code

    // Generate QR code with increased size
    QRCode.toDataURL(qrText, { 
      width: 300, // Set width to 300px (increase size)
      height: 300, // Set height to match width for square shape
      color: { dark: '#000000', light: '#ffffff' }
    }, function (error, url) {
      if (error) {
        console.error(error);
      } else {
        const img = document.createElement('img');
        img.src = url;
        img.width = 300; // Set the image width
        img.height = 300; // Set the image height
        qrCodeContainer.appendChild(img); // Display the generated QR code image
      }
    });
  }