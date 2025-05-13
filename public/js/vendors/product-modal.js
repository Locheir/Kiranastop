
document.addEventListener("DOMContentLoaded", function () {
    const quickViewButtons = document.querySelectorAll(".modal-btn-action");
  
    console.log('here');
    quickViewButtons.forEach(button => {
      button.addEventListener("click", () => {
        // Set text fields
        document.getElementById("modalProductName").textContent = button.dataset.name;
        document.getElementById("modalProductPrice").textContent = `Rs. ${button.dataset.saleprice}`;
        document.getElementById("modalProductOldPrice").textContent = `Rs. ${button.dataset.oldprice}`;
        document.getElementById("modalProductWeight").textContent = ` ${button.dataset.weight} g`;
        document.getElementById("modalProductQuantity").textContent = button.dataset.quantity;
        document.getElementById("modalProductCategory").textContent = button.dataset.category;
  
        // Set main image
        const mainImage = document.getElementById("modalImgMain");
        const mainZoom = document.getElementById("modalZoom");
        const thumbImage = document.getElementById("modalImgThumb1");
  
        mainImage.src = button.dataset.img1;
        if (thumbImage) thumbImage.src = button.dataset.img1;
  
        // Set zoom background
        if (mainZoom) {
          mainZoom.style.backgroundImage = `url(${button.dataset.img1})`;
        }
  
        // Log for debugging
        console.log("Quick view loaded:", button.dataset);
      });
    });
  });