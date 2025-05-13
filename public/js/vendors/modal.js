// document.addEventListener("DOMContentLoaded", function () {
//     const quickViewButtons = document.querySelectorAll(".modal-btn-action");

//     quickViewButtons.forEach(button => {
//       button.addEventListener("click", () => {
//         // Text content
//         document.getElementById("modalProductName").textContent = button.dataset.name;
//         document.getElementById("modalProductPrice").textContent = `Rs. ${button.dataset.saleprice}`;
//         document.getElementById("modalProductOldPrice").textContent = `Rs. ${button.dataset.oldprice}`;
//         // document.getElementById("modalProductDiscount").textContent = `${button.dataset.discount}% Off`;

//         // Images
//         document.getElementById("modalImg1").src = button.dataset.img1;
//         // document.getElementById("modalImg2").src = button.dataset.img2;
//         // document.getElementById("modalImg3").src = button.dataset.img3;
//         // document.getElementById("modalImg4").src = button.dataset.img4;

//         // Table info
//         // document.getElementById("modalProductCode").textContent = button.dataset.code;
//         document.getElementById("modalProductQuantity").textContent = button.dataset.quantity;
//         document.getElementById("modalProductType").textContent = button.dataset.category;

//         // Optional: update background-image in zoom() if you’re using it
//         document.querySelectorAll(".zoom").forEach((zoomDiv, i) => {
//           zoomDiv.style.backgroundImage = `url(${button.dataset[`img${i + 1}`]})`;
//         });
//       });
//     });
//   });

window.addEventListener("load",function(){setTimeout(function(){new bootstrap.Modal(document.getElementById("modal-subscribe")).show()},3e3)});
  
//   Optional subscribe popup on load
//   window.addEventListener("load", function () {
//     setTimeout(function () {
//       const modalEl = document.getElementById("modal-subscribe");
//       if (modalEl) {
//         new bootstrap.Modal(modalEl).show();
//       }
//     }, 3000);
//   });
  