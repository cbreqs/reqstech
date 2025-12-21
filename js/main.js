document.addEventListener('DOMContentLoaded', () => {
  // Parallax scroll effect
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    document.documentElement.style.backgroundPositionY = `-${scrolled * 0.2}px`;
  });

  // Scroll-to-top button
  const scrollTopBtn = document.getElementById('scroll-top');

  // Only add the event listener if the button exists on the page
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.style.display = 'block';
      } else {
        scrollTopBtn.style.display = 'none';
      }
    });
  }
});
