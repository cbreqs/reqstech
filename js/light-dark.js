// light-dark.js

// Apply saved mode on page load
document.addEventListener("DOMContentLoaded", function () {
  const savedMode = localStorage.getItem("mode");

  if (savedMode === "light") {
    document.body.classList.add("light-mode");
  }

  const toggleButton = document.querySelector("a[onclick*='toggle']");
  if (toggleButton) {
    toggleButton.addEventListener("click", function (event) {
      event.preventDefault();
      document.body.classList.toggle("light-mode");

      const newMode = document.body.classList.contains("light-mode")
        ? "light"
        : "dark";

      localStorage.setItem("mode", newMode);
    });
  }
});
