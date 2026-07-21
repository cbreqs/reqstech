// ---- Config ----
const CONTACT_EMAIL = "hello@example.com"; // update this to her real email
const CAROUSEL_INTERVAL_MS = 5000;

// ---- State ----
let currentSlide = 0;
let carouselTimer = null;

// ---- Load products ----
fetch("products.json")
  .then((res) => {
    if (!res.ok) throw new Error("Could not load products.json");
    return res.json();
  })
  .then((products) => {
    renderGrid(products);
    renderCarousel(products.filter((p) => p.featured && !p.soldOut));
  })
  .catch((err) => {
    console.error(err);
    document.getElementById("product-grid").innerHTML =
      '<p style="grid-column:1/-1;text-align:center;color:#5a5a63;">Products couldn\'t be loaded. If you\'re viewing this file directly on your computer, run a local server (see README) or view the deployed site.</p>';
  });

// ---- Grid ----
function renderGrid(products) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = products.map(productCardHTML).join("");
  grid.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => handleBuy(btn.dataset.buy, products));
  });
}

function productCardHTML(p) {
  return `
    <div class="product-card">
      <div class="${p.soldOut ? "sold-out-badge" : ""}">
        <img src="${p.image}" alt="${escapeHTML(p.name)}" loading="lazy">
      </div>
      <div class="product-body">
        <p class="product-category">${escapeHTML(p.category || "")}</p>
        <h3>${escapeHTML(p.name)}</h3>
        <p class="desc">${escapeHTML(p.description || "")}</p>
        <div class="product-footer">
          <span class="product-price">$${escapeHTML(p.price)}</span>
          <button class="buy-btn" data-buy="${p.id}" ${p.soldOut ? "disabled" : ""}>
            ${p.soldOut ? "Sold Out" : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleBuy(id, products) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  if (product.stripeLink) {
    window.open(product.stripeLink, "_blank", "noopener");
  } else {
    const subject = encodeURIComponent(`Order: ${product.name}`);
    const body = encodeURIComponent(
      `Hi! I'd like to order "${product.name}" ($${product.price}). Please let me know how to pay and arrange pickup/shipping.`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }
}

// ---- Carousel ----
function renderCarousel(featured) {
  const track = document.getElementById("carousel-track");
  const dotsWrap = document.getElementById("carousel-dots");
  const section = document.querySelector(".carousel-section");

  if (!featured.length) {
    section.style.display = "none";
    return;
  }

  track.innerHTML = featured.map(slideHTML).join("");
  dotsWrap.innerHTML = featured
    .map((_, i) => `<button class="dot${i === 0 ? " active" : ""}" data-slide="${i}"></button>`)
    .join("");

  track.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", () => handleBuy(btn.dataset.buy, featured));
  });

  dotsWrap.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(Number(dot.dataset.slide), featured.length);
      resetTimer(featured.length);
    });
  });

  document.getElementById("carousel-prev").addEventListener("click", () => {
    goToSlide(currentSlide - 1, featured.length);
    resetTimer(featured.length);
  });
  document.getElementById("carousel-next").addEventListener("click", () => {
    goToSlide(currentSlide + 1, featured.length);
    resetTimer(featured.length);
  });

  if (featured.length > 1) resetTimer(featured.length);
}

function slideHTML(p) {
  return `
    <div class="carousel-slide">
      <img src="${p.image}" alt="${escapeHTML(p.name)}">
      <div class="carousel-info">
        <p class="tag">Featured</p>
        <h3>${escapeHTML(p.name)}</h3>
        <p class="desc">${escapeHTML(p.description || "")}</p>
        <p class="price">$${escapeHTML(p.price)}</p>
        <button class="btn btn-primary" data-buy="${p.id}" style="width:fit-content;" ${p.soldOut ? "disabled" : ""}>
          ${p.soldOut ? "Sold Out" : "Buy Now"}
        </button>
      </div>
    </div>
  `;
}

function goToSlide(index, total) {
  currentSlide = ((index % total) + total) % total;
  const track = document.getElementById("carousel-track");
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll(".carousel-dots .dot").forEach((d, i) => {
    d.classList.toggle("active", i === currentSlide);
  });
}

function resetTimer(total) {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => goToSlide(currentSlide + 1, total), CAROUSEL_INTERVAL_MS);
}

// ---- Utils ----
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
