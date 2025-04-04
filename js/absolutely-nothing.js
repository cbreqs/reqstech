let rerollButton;
let container = document.getElementById("civil-slot");
let currentPage = window.location.pathname;

document.addEventListener('keydown', (e) => {
  // Check for Shift+R key combination
  if (e.shiftKey && e.key.toLowerCase() === 'r') {
    if (!rerollButton && currentPage !== '/index.html') {
      rerollButton = document.createElement('button');
      rerollButton.textContent = "civil options";
      rerollButton.className = "civil-btn";

      // When clicked, redirect to civil.html
      rerollButton.addEventListener('click', () => {
        window.location.href = 'civil.html'; // Redirect to civil.html
      });

      container.appendChild(rerollButton);
    } else if (rerollButton) {
      rerollButton.style.display = rerollButton.style.display === "none" ? "block" : "none"; // Toggle visibility
    }
  }

  // Hide button on homepage
  if (currentPage === '/index.html') {
    if (rerollButton) {
      rerollButton.style.display = "none"; // Hide button on homepage
    }
  }
});
