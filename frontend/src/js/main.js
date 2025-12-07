// frontend/js/main.js
console.log('main.js loaded');

// สัญชาติญาณแรก: ถ้าต้องการทดสอบปุ่ม cart
document.addEventListener('DOMContentLoaded', () => {
  const openCartBtn = document.getElementById('openCartBtn');
  if (openCartBtn) {
    openCartBtn.addEventListener('click', () => {
      console.log('openCartBtn clicked');
      alert('Open cart clicked (test)');
    });
  }
});
