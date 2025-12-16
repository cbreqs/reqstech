document.addEventListener('DOMContentLoaded', () => {
  const toggleModeBtn = document.getElementById('toggle-mode');
  const body = document.body;

  if (toggleModeBtn) {
    toggleModeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      body.classList.toggle('light-mode');
      body.classList.toggle('dark-mode');

      // Store the user's preference
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }

  // Apply the stored theme on page load
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    body.classList.add('dark-mode');
    body.classList.remove('light-mode');
  } else {
    // Default to light mode
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
  }
});