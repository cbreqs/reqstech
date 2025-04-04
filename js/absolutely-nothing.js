// DevMode Toggle: Press Shift+R to show/hide the "civil options" button
let rerollButton;
let container = document.getElementById("civil-slot");

document.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.key.toLowerCase() === 'r') {
    if (!rerollButton) {
      rerollButton = document.createElement('button');
      rerollButton.textContent = "civil options";
      rerollButton.className = "civil-btn";

      // You can replace this with another action if needed
      rerollButton.addEventListener('click', () => {
        alert("Civil options clicked!");
      });

      container.appendChild(rerollButton);
    } else {
      rerollButton.style.display = rerollButton.style.display === "none" ? "block" : "none";
    }
  }
});
