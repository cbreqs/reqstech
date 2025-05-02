// Apply saved mode on page load
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement; // <html> element
  const savedMode = localStorage.getItem("mode");

  if (savedMode === "light") {
    root.classList.add("light-mode");
  }

  const toggleButton = document.getElementById("toggle-mode");
  if (toggleButton) {
    toggleButton.addEventListener("click", function (event) {
      event.preventDefault();
      root.classList.toggle("light-mode");

      const newMode = root.classList.contains("light-mode")
        ? "light"
        : "dark";

      localStorage.setItem("mode", newMode);
    });
  }
});
