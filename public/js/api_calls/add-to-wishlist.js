document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".add-to-wishlist").forEach(button => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        const productId = button.getAttribute("data-product-id");
  
        try {
          const res = await fetch("/home/wishlist/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId })
          });
  
          const data = await res.json();

          if (res.status === 401 && data.loginRequired) {
            window.location.href = "/login"; // Manual redirect on frontend
            return;
          }
          
          
            const modal = new bootstrap.Modal(document.getElementById('productAddedModal'));
            const modalTextDisplay = document.getElementById('add-cart-text');
            
            modalTextDisplay.innerText = data.message;

            modal.show();
          
        } catch (err) {
          console.error(err);
          alert("Error adding to wishlist.");
        }
      });
    });
  });
  