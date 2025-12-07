// src/js/product-detail.js
import { addToCart, cartTotalCount } from './cart.js';

async function loadProducts() {
  const res = await fetch('/src/assets/data/products.json');
  if (!res.ok) throw new Error('Cannot load products.json');
  return res.json();
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function renderImages(images = []) {
  return images.map(src => `<div class="swiper-slide"><ion-img src="${src}" class="slides-product-image"></ion-img></div>`).join('');
}

function updateCartBadge() {
  const badgeEls = document.querySelectorAll('.noti-count');
  const count = cartTotalCount();
  badgeEls.forEach(el => el.textContent = count > 0 ? count : '');
}

// render product detail into DOM; selector targets assume original HTML structure
function renderProduct(product) {
  // images (replace .pd-image-slide .swiper-wrapper)
  const imageWrapper = document.querySelector('.pd-image-slide');
  if (imageWrapper) imageWrapper.innerHTML = product.images ? renderImages(product.images) : '';

  // label
  const label = document.querySelector('.product-label span');
  if (label) label.textContent = product.label || '';

  // title
  const title = document.querySelector('.product-title');
  if (title) title.textContent = product.name || '';

  // price
  const priceD = document.querySelector('.price-d');
  if (priceD) priceD.innerHTML = `฿${product.price}<span class="price-o">฿${product.price_old}</span>`;

  const yourPrice = document.querySelector('.price-w.border-left .price-d');
  if (yourPrice) yourPrice.textContent = `฿${product.your_price || product.price}`;

  // points
  const points = document.querySelector('.points');
  if (points) points.textContent = product.points || '';

  // description -> put into overview slide (assumes .pd-overview exists)
  const overview = document.querySelector('.pd-overview');
  if (overview) {
    const p = overview.querySelector('p');
    if (p) p.innerHTML = product.description || '';
  }

  // bundle section / product images for slider (if any)
  updateCartBadge();
  initSwiper(); // re-init swiper after DOM change
}

function initSwiper() {
  // safe-init: destroy previous if present
  if (window._fitSwiperInit) {
    try {
      window._fitSwiperInit.destroy(true, true);
    } catch (e) {}
  }
  // init new swiper on elements with .slider-item
  window._fitSwiperInit = new Swiper('.slider-item', {
    slidesPerView: 'auto',
    spaceBetween: 0
  });
}

function bindAddToCart(product) {
  const addBtn = document.querySelector('.main-footer-btn');
  if (!addBtn) return;
  addBtn.addEventListener('click', (e) => {
    addToCart(product, 1);
    updateCartBadge();
    // optional: show a temporary visual (toast) or open cart modal
    // For now, console log
    console.log('added to cart', product.id);
    // if we have a function to open modal, call it:
    const openCartBtn = document.querySelector('.open-cart-btn');
    if (openCartBtn) openCartBtn.click();
  });
}

async function init() {
  try {
    const products = await loadProducts();
    // get id from URL ?id=1 - fallback to first product
    const idParam = parseInt(getQueryParam('id')) || products[0].id;
    const product = products.find(p => p.id === idParam) || products[0];
    renderProduct(product);
    bindAddToCart(product);
  } catch (e) {
    console.error('Product detail init error', e);
  }
}

// start
document.addEventListener('DOMContentLoaded', () => {
  init();
  // also update cart badge on load
  updateCartBadge();
});
