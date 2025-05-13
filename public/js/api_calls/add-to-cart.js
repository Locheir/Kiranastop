document.querySelectorAll('.add-cart-button').forEach(button => {
    button.addEventListener('click', async function (e) {
        e.preventDefault();
      const productId = this.getAttribute('data-product-id');
        
      try {
        const response = await fetch('/home/addToCart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: productId,
            quantity: 1
          })
        });

        const data = await response.json();

        if (response.status === 401 && data.loginRequired) {
          window.location.href = "/login"; // Manual redirect on frontend
          return;
        }

        
        if (data.success) {
            console.log("in popup code...")
            const modal = new bootstrap.Modal(document.getElementById('productAddedModal'));
            const modalTextDisplay = document.getElementById('add-cart-text');
            
            modalTextDisplay.innerText = data.message;

            modal.show();
        } else {
            const modal = new bootstrap.Modal(document.getElementById('productAddedModal'));
            const modalTextDisplay = document.getElementById('add-cart-text');
            
            modalTextDisplay.innerText = data.message;

            modal.show();
        }
      } catch (err) {
        console.error('Error adding to cart:', err);
      }
    });
  });
  