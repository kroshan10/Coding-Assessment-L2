document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const checkoutButton = document.getElementById("checkout-button");

  let cartData = [];

  // Fetch cart data from API
  async function fetchCartData() {
    try {
      const response = await fetch(API_URL);
      const { items } = await response.json();
      cartData = items;
      renderCart();
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    }
  }

  // Render cart items
  function renderCart() {
    cartItemsContainer.innerHTML = cartData.map((item, index) => createCartItemHTML(item, index)).join("");
    attachEventListeners();
    updateTotals();
  }

  // Create HTML for each cart item
  function createCartItemHTML(item, index) {
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="Product_img">
        <div class="cart-item-details">
          <p>${item.title}</p>
          <p>Rs. ${formatCurrency(item.price)}</p>
          <label>
            <input type="number" min="1" value="${item.quantity}" data-index="${index}">
          </label>
          <p class="sub-total">Rs. <span id="item-subtotal-${index}">${formatCurrency(item.line_price)}</span></p>
        </div>
        <button class="remove-btn" data-index="${index}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="logo delete-logo">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    `;
  }

  // Attach event listeners to cart elements
  function attachEventListeners() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener("change", handleQuantityChange);
    });
    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", handleRemoveItem);
    });
    checkoutButton.addEventListener("click", handleCheckout);
  }

  // Handle quantity change
  function handleQuantityChange(event) {
    const index = event.target.dataset.index;
    const newQuantity = Math.max(1, parseInt(event.target.value, 10));

    cartData[index].quantity = newQuantity;
    cartData[index].line_price = cartData[index].price * newQuantity;

    document.getElementById(`item-subtotal-${index}`).textContent = formatCurrency(cartData[index].line_price);
    updateTotals();
  }

  // Handle item removal
  function handleRemoveItem(event) {
    const index = event.target.closest("button").dataset.index;
    cartData.splice(index, 1);
    renderCart();
  }

  // Handle checkout
  function handleCheckout() {
    alert("Thank you for your purchase! Proceeding to checkout...");
  }

  // Update subtotal and total
  function updateTotals() {
    const subtotal = cartData.reduce((sum, item) => sum + item.line_price, 0);
    subtotalElement.textContent = `Rs. ${formatCurrency(subtotal)}`;
    totalElement.textContent = `Rs. ${formatCurrency(subtotal)}`;
  }

  // Format currency
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount / 100);
  }

  fetchCartData();
});
