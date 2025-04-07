// rotate-gallery.js

document.addEventListener("DOMContentLoaded", () => {
  const qrImage = document.getElementById("qr-rotate");
  const qrVariants = [
    "assets/qr-pearl.png",
    "assets/qr-silver.png",
    "assets/qr-navy.png",
    "assets/qr-black.png"
  ];

  let currentIndex = 0;

  // Automatic rotation every 2.5 seconds
  let interval = setInterval(nextImage, 2500);

  function showImage(index) {
    qrImage.src = qrVariants[index];
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % qrVariants.length;
    showImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + qrVariants.length) % qrVariants.length;
    showImage(currentIndex);
  }

  // Button controls
  document.getElementById("next-qr").addEventListener("click", () => {
    clearInterval(interval); // Stop auto-rotate when user clicks
    nextImage();
  });

  document.getElementById("prev-qr").addEventListener("click", () => {
    clearInterval(interval); // Stop auto-rotate when user clicks
    prevImage();
  });

  // Initial image
  showImage(currentIndex);
});
