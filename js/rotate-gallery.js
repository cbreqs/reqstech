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
  // DASH Variant

const dashImage = document.getElementById("dash-rotate");
if (dashImage) {
  const dashVariants = [
    "assets/dash-pearl.png",
    "assets/dash-silver.png",
    "assets/dash-navy.png",
    "assets/dash-black.png"
  ];

  let dashIndex = 0;
  let dashInterval = setInterval(nextDash, 2500);

  function showDash(index) {
    dashImage.src = dashVariants[index];
  }

  function nextDash() {
    dashIndex = (dashIndex + 1) % dashVariants.length;
    showDash(dashIndex);
  }

  function prevDash() {
    dashIndex = (dashIndex - 1 + dashVariants.length) % dashVariants.length;
    showDash(dashIndex);
  }

  document.getElementById("next-dash").addEventListener("click", () => {
    clearInterval(dashInterval);
    nextDash();
  });

  document.getElementById("prev-dash").addEventListener("click", () => {
    clearInterval(dashInterval);
    prevDash();
  });

  showDash(dashIndex);
}
  // QUOTE Variant

const quoteImage = document.getElementById("quote-rotate");
if (quoteImage) {
  const quoteVariants = [
    "assets/quote-pearl.png",
    "assets/quote-silver.png",
    "assets/quote-navy.png",
    "assets/quote-black.png"
  ];

  let quoteIndex = 0;
  let quoteInterval = setInterval(nextQuote, 2500);

  function showQuote(index) {
    quoteImage.src = quoteVariants[index];
  }

  function nextQuote() {
    quoteIndex = (quoteIndex + 1) % quoteVariants.length;
    showQuote(quoteIndex);
  }

  function prevQuote() {
    quoteIndex = (quoteIndex - 1 + quoteVariants.length) % quoteVariants.length;
    showQuote(quoteIndex);
  }

  document.getElementById("next-quote").addEventListener("click", () => {
    clearInterval(quoteInterval);
    nextQuote();
  });

  document.getElementById("prev-quote").addEventListener("click", () => {
    clearInterval(quoteInterval);
    prevQuote();
  });

  showQuote(quoteIndex);
}

