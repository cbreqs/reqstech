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

  setInterval(() => {
    currentIndex = (currentIndex + 1) % qrVariants.length;
    qrImage.src = qrVariants[currentIndex];
  }, 2500); // 2.5 seconds per image
});
