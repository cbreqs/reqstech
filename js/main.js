document.addEventListener('DOMContentLoaded', () => {
  const toggleModeBtn = document.getElementById('toggle-mode');
  const body = document.body;
  const backgroundContainer = document.getElementById('background-container');

  // 1. Light/Dark Mode Toggle
  toggleModeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
  });

  // 2. Parallax Scrolling Effect
  window.addEventListener('scroll', () => {
    const offset = window.pageYOffset;
    backgroundContainer.style.transform = `translateY(${offset * 0.5}px)`;
  });

  // 3. Smooth Scrolling for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId && targetId !== '#'){
        const targetElement = document.querySelector(targetId);
        if(targetElement){
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 4. Dynamic Title (from original index.html)
  const titles = [
    "reqs.tech | Technically Creative",
    "reqs.tech | Creatively Technical",
    "reqs.tech | BIM/VDC Solutions",
    "reqs.tech | Technical Ingenuity",
    "reqs.tech | drawing creativity from building chaos",
    "reqs.tech | Technical Ingenuity",
    "reqs.tech | BIM Ingenuity",
    "reqs.tech | Building BIM",
    "reqs.tech | Building Creativity",
    "reqs.tech | Creative Building",
  ];
  const randomIndex = Math.floor(Math.random() * titles.length);
  document.title = titles[randomIndex];

  // 5. Modal
  window.openModal = function(imageSrc) {
      const modal = document.getElementById('modal');
      const modalImage = document.getElementById('modal-image');
      modalImage.src = imageSrc;
      modal.style.display = 'flex';
  }

  window.closeModal = function() {
      document.getElementById('modal').style.display = 'none';
  }

});
