// src/js/cart.js
const CART_KEY = 'fw_cart';

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('getCart error', e);
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.id === product.id);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      qty: qty
    });
  }
  saveCart(cart);
  return cart;
}

export function updateQty(productId, qty) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx > -1) {
    cart[idx].qty = Math.max(0, qty);
    if (cart[idx].qty === 0) cart.splice(idx, 1);
    saveCart(cart);
  }
  return cart;
}

export function removeItem(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  return cart;
}

export function cartTotalCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

export function cartTotalPrice() {
  return getCart().reduce((s, i) => s + i.qty * i.price, 0);
}
