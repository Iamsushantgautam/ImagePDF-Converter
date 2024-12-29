function toggleMenu() {
    const menuWindow = document.getElementById('menuWindow');
    const profileWindow = document.getElementById('profileWindow');

    // Close profileWindow if it is open
    if (profileWindow.style.display === 'block') {
        profileWindow.style.display = 'none';
    }

    // Toggle menuWindow
    menuWindow.style.display = menuWindow.style.display === 'block' ? 'none' : 'block';
}

function toggleprofile() {
    const menuWindow = document.getElementById('menuWindow');
    const profileWindow = document.getElementById('profileWindow');

    // Close menuWindow if it is open
    if (menuWindow.style.display === 'block') {
        menuWindow.style.display = 'none';
    }

    // Toggle profileWindow
    profileWindow.style.display = profileWindow.style.display === 'block' ? 'none' : 'block';
}