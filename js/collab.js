// Lazy load images
document.addEventListener("DOMContentLoaded", function() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          lazyImageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function(img) {
      lazyImageObserver.observe(img);
    });
  }
});

// Scroll to Top Button
const scrollTopButton = document.createElement('button');
scrollTopButton.innerText = "↑ Top";
scrollTopButton.id = "scrollTopBtn";
document.body.appendChild(scrollTopButton);

scrollTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  
  document.body.style.setProperty('--scroll-offset', scrolled + 'px');
});
// Animate gradient background scroll position
window.addEventListener('scroll', () => {
  const scrollOffset = window.scrollY;
  const gradient = document.getElementById('bg-gradient');
  if (gradient) {
    gradient.style.backgroundPosition = `center ${scrollOffset * 0.2}px`;
  }
});
