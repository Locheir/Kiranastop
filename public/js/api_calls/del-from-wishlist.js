document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');
  
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const productId = button.getAttribute('data-id');
  
        try {
          const res = await fetch(`/home/wishlist/remove/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          const data = await res.json();

          const modal = new bootstrap.Modal(document.getElementById('productAddedModal'));
          const modalTextDisplay = document.getElementById('add-cart-text');
          
          modalTextDisplay.innerText = data.message;

          modal.show();

          setTimeout(() => {
            location.reload();
          }, 500);

        } catch (err) {
          console.error("Error:", err);
        }
      });
    });
  });