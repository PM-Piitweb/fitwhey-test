// src/js/cart-modal.js
import { getCart, cartTotalPrice, updateQty, removeItem } from './cart.js';

export function renderCartModal() {
  const itemsContainer = document.querySelector('#cart-items');
  if (!itemsContainer) return;
  const cart = getCart();
  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p>Your cart is empty</p>';
    document.querySelector('#cart-total').textContent = '฿0';
    return;
  }
  itemsContainer.innerHTML = cart.map(i => `
    <div class="cart-row" data-id="${i.id}">
      <img src="${i.image}" width="60" />
      <div class="cart-info">
        <div class="cart-title">${i.name}</div>
        <div class="cart-price">฿${i.price} x ${i.qty}</div>
      </div>
      <div class="cart-actions">
        <button class="cart-dec">-</button>
        <span class="qty">${i.qty}</span>
        <button class="cart-inc">+</button>
        <button class="cart-remove">Remove</button>
      </div>
    </div>
  `).join('');
  document.querySelector('#cart-total').textContent = `฿${cartTotalPrice()}`;

  // bind buttons
  itemsContainer.querySelectorAll('.cart-inc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('.cart-row').dataset.id);
      const row = getCart().find(x=>x.id===id);
      updateQty(id, row.qty + 1);
      renderCartModal();
    });
  });
  itemsContainer.querySelectorAll('.cart-dec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('.cart-row').dataset.id);
      const row = getCart().find(x=>x.id===id);
      updateQty(id, row.qty - 1);
      renderCartModal();
    });
  });
  itemsContainer.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.closest('.cart-row').dataset.id);
      removeItem(id);
      renderCartModal();
    });
  });
}
