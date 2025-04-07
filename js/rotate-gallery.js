document.addEventListener("DOMContentLoaded", function () {
  const qrImages = [
    "assets/qr-pearl.png",
    "assets/qr-silver.png",
    "assets/qr-navy.png",
    "assets/qr-black.png"
  ];

  let index = 0;
  const qrImage = document.getElementById("qr-rotate");

  if (qrImage) {
    setInterval(() => {
      index = (index + 1) % qrImages.length;
      qrImage.src = qrImages[index];
    }, 2000); // rotate every 2 seconds
  }
});
