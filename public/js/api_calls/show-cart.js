const cartModal = document.getElementById('offcanvasRight');

cartModal.addEventListener('show.bs.offcanvas', async () => {
  try {
    const response = await fetch('/home/getCart');
    const data = await response.json();

    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Clear existing content

    if (data.success && data.products.length > 0) {
      data.products.forEach(product => {
        const item = `
          <li class="list-group-item py-3 ps-0 border-top">
            <div class="row align-items-center">
              <div class="col-6 col-md-6 col-lg-7">
                <div class="d-flex">
                  <img src="${product.image}" alt="${product.name}" class="icon-shape icon-xxl" />
                  <div class="ms-3">
                    <h6 class="mb-0">${product.name}</h6>
                    <span><small class="text-muted">Qty: ${product.quantity}</small></span>
                    <div class="mt-2 small lh-1">
                      <a href="#!" class="text-decoration-none text-inherit">
                        <span class="me-1 align-text-bottom">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-trash-2 text-success">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </span>
                        <span class="text-muted">Remove</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4 col-md-3 col-lg-3">
                <div class="input-group input-spinner">
                  <input type="button" value="-" class="button-minus btn btn-sm" data-product-id="${product.id}"/>
                  <input type="number" value="${product.quantity}" class="quantity-field form-control-sm form-input" readonly/>
                  <input type="button" value="+" class="button-plus btn btn-sm" data-product-id="${product.id}"/>
                </div>
              </div>
              <div class="col-2 text-lg-end text-start text-md-end col-md-2">
                <span class="fw-bold">Rs. ${product.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </li>`;
        cartList.insertAdjacentHTML('beforeend', item);
      });
    } else {
      cartList.innerHTML = `<li class="list-group-item py-3 text-center">Your cart is empty.</li>`;
    }
  } catch (error) {
    console.error('Failed to fetch cart:', error);
  }
});

document.addEventListener("DOMContentLoaded", function () {
    const cartList = document.getElementById('cart-list');
  
    cartList.addEventListener('click', function (e) {
      const target = e.target;
      if (target.classList.contains('button-minus') || target.classList.contains('button-plus')) {
        const productId = target.getAttribute('data-product-id');
        const qtyInput = target.parentElement.querySelector('.quantity-field');
        let qty = parseInt(qtyInput.value);
  
        if (target.classList.contains('button-minus') && qty > 1) {
          qtyInput.value = --qty;
          updateCart(productId, qty);
        }
  
        if (target.classList.contains('button-plus')) {
          qtyInput.value = ++qty;
          updateCart(productId, qty);
        }
      }
    });
  
    function updateCart(productId, newQty) {
      fetch('/home/update-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity: newQty })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('Cart updated!');
          const button = document.querySelector(`.button-minus[data-product-id="${productId}"], .button-plus[data-product-id="${productId}"]`);
      if (!button) return;

      // Find the closest row or item container
      const productRow = button.closest('.row');
      if (!productRow) return;

      // Update the price span inside that product row
      const priceSpan = productRow.querySelector('span.fw-bold');
      if (priceSpan) {
        priceSpan.textContent = `Rs. ${data.totalPrice.toFixed(2)}`;
      }
        } else {
          console.error('Failed to update cart');
        }
      });
    }
  });