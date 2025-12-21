function initializeGallery() {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const closeModal = document.querySelector('.close-modal');
    
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryScrollContainer = document.querySelector('.gallery-scroll-container');
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    
    const prevArrow = document.querySelector('.gallery-arrow.prev');
    const nextArrow = document.querySelector('.gallery-arrow.next');

    if (!galleryWrapper || !galleryWrapper.children.length) {
        console.log('Gallery wrapper not found or is empty.');
        return; // Exit if no gallery to initialize
    }

    // --- Infinite Carousel Setup ---
    const originalCards = Array.from(galleryWrapper.children);
    originalCards.forEach(card => {
        galleryWrapper.appendChild(card.cloneNode(true));
    });

    galleryWrapper.style.display = 'flex';
    galleryWrapper.style.transition = 'transform 0.5s ease-in-out';

    // --- Responsive, Card-by-Card Advancement Logic ---
    let autoScrollInterval;
    let currentPosition = 0;
    let scrollStep = 0; // Will be calculated dynamically
    let totalOriginalWidth = 0;
    const numOriginalCards = originalCards.length;

    const calculateMetrics = () => {
        const firstCard = galleryWrapper.children[0];
        if (!firstCard) return;
        const cardStyle = window.getComputedStyle(firstCard);
        const cardMarginRight = parseFloat(cardStyle.marginRight);
        scrollStep = firstCard.offsetWidth + cardMarginRight;
        totalOriginalWidth = numOriginalCards * scrollStep;
    };

    const updateGalleryPosition = () => {
        galleryWrapper.style.transform = `translateX(-${currentPosition}px)`;
    };

    const advanceCarousel = () => {
        currentPosition += scrollStep;
        updateGalleryPosition();
    };

    galleryWrapper.addEventListener('transitionend', () => {
        if (currentPosition >= totalOriginalWidth) {
            galleryWrapper.style.transition = 'none';
            currentPosition -= totalOriginalWidth;
            updateGalleryPosition();
            galleryWrapper.offsetHeight; // Force repaint
            galleryWrapper.style.transition = 'transform 0.5s ease-in-out';
        }
    });

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    const startAutoScroll = () => {
        stopAutoScroll();
        calculateMetrics();
        if (scrollStep > 0) { // Only start if there are cards to scroll
            autoScrollInterval = setInterval(advanceCarousel, 10000);
        }
    };

    // --- User Interaction ---
    nextArrow.addEventListener('click', () => {
        advanceCarousel();
        startAutoScroll();
    });

    prevArrow.addEventListener('click', () => {
        if (currentPosition < scrollStep) {
            galleryWrapper.style.transition = 'none';
            currentPosition += totalOriginalWidth;
            updateGalleryPosition();
            galleryWrapper.offsetHeight;
            galleryWrapper.style.transition = 'transform 0.5s ease-in-out';
        }
        currentPosition -= scrollStep;
        updateGalleryPosition();
        startAutoScroll();
    });
    
    // --- Window Resize Handling ---
    window.addEventListener('resize', () => {
      stopAutoScroll();
      currentPosition = 0;
      updateGalleryPosition();
      startAutoScroll();
    });

    galleryContainer.addEventListener('mouseenter', stopAutoScroll);
    galleryContainer.addEventListener('mouseleave', startAutoScroll);

    // --- Modal Handling ---
    const allCards = galleryWrapper.querySelectorAll('.gallery-card');
    allCards.forEach(card => {
        card.addEventListener('click', (e) => {
            stopAutoScroll();
            modal.style.display = 'block';
            const img = e.currentTarget.querySelector('img');
            const h3 = e.currentTarget.querySelector('h3');
            const p = e.currentTarget.querySelector('p');
            modalImg.src = img ? img.src : '';
            modalCaption.innerHTML = (h3 ? h3.innerHTML : '') + '<br>' + (p ? p.innerHTML : '');
        });
    });

    const closeModalAction = () => {
        modal.style.display = 'none';
        startAutoScroll();
    };

    if (closeModal) {
        closeModal.addEventListener('click', closeModalAction);
    }
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModalAction();
        }
    });

    // --- Start the Carousel ---
    startAutoScroll();
}