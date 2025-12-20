document.addEventListener('DOMContentLoaded', () => {
  const toggleModeBtn = document.getElementById('toggle-mode');
  const htmlEl = document.documentElement;

  // Function to apply the correct theme class
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      htmlEl.classList.add('dark-mode');
      htmlEl.classList.remove('light-mode');
    } else { // 'light'
      htmlEl.classList.add('light-mode');
      htmlEl.classList.remove('dark-mode');
    }
  };

  // Default to dark mode
  applyTheme('dark');

  // Event listener for the theme toggle button
  if (toggleModeBtn) {
    toggleModeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Check the current theme and toggle to the other
      const newTheme = htmlEl.classList.contains('dark-mode') ? 'light' : 'dark';
      applyTheme(newTheme);
      // Store the new preference
      localStorage.setItem('theme', newTheme);
    });
  }
});
