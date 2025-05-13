Dropzone.autoDiscover = !1;

document.addEventListener("DOMContentLoaded", function () {
  // ✅ Initialize Quill
  const quill = new Quill("#editor", {
    theme: "snow"
  });

  // ✅ Initialize Dropzone
  if (Dropzone.instances.length === 0) {
    const dz = new Dropzone("#my-dropzone", {
      url: "/upload-temp",
      autoProcessQueue: false,
      uploadMultiple: true,
      addRemoveLinks: true,
      parallelUploads: 10,
      maxFiles: 10,
      paramName: "images",
      acceptedFiles: "image/*"
    });

    // ✅ On Create Product Click
    document.getElementById("createproduct").addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Create Product clicked");

      const formData = new FormData();

      // 🔽 Input fields
      formData.append("name", document.querySelector('[name="name"]').value);
      formData.append("category", document.querySelector('[name="category"]').value);
      formData.append("weight", document.querySelector('[name="weight"]').value);
      formData.append("quantity", document.querySelector('[name="quantity"]').value);
      formData.append("reg_price", document.querySelector('[name="reg_price"]').value);
      formData.append("sale_price", document.querySelector('[name="sale_price"]').value);

      // 🔽 Radio buttons (status)
      const status = document.querySelector('input[name="inlineRadioOptions"]:checked')?.value;
      console.log(status);
      if (status == 'option1') {
        formData.append("status", true);
      } else {
        formData.append("status", false);
      }
      

      // 🔽 Quill description
      formData.append("description", quill.root.innerText);

      // 🔽 Dropzone files
      dz.files.forEach(file => {
        formData.append("images", file);
      });

      // ✅ Send it to backend
      fetch("/dashboard/addProduct", {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          dz.removeAllFiles();
          quill.root.innerHTML = "";
          const alertContainer = document.getElementById('alert-container');
          alertContainer.innerHTML = `
          <div class="alert alert-${data.success ? 'success' : 'danger'} mt-3" role="alert">
            ${data.message}
          </div>
        `;
        })
        .catch(err => {
          console.error("Upload failed", err);
          alert("Something went wrong");
        });
    });
  }
});
