fetch('../files/nav.html') // Adjust the relative path as per your structure
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  })
  .then((html) => {
    // Do something with the HTML content
    console.log(html);
    document.getElementById('nav').innerHTML = html;
  })
  .catch((error) => {
    console.error('Error fetching the file:', error);
  });
