let rerollButton;
let container = document.getElementById("civil-slot");

document.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.key.toLowerCase() === 'r') {
    if (!rerollButton) {
      rerollButton = document.createElement('button');
      rerollButton.textContent = "civil options";
      rerollButton.className = "civil-btn";

      rerollButton.addEventListener('click', () => {
        alert("Civil options clicked!");
      });

      container.appendChild(rerollButton);
    } else {
      rerollButton.style.display = rerollButton.style.display === "none" ? "block" : "none";
    }
  }
});
