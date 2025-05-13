document.querySelector('#createcategory').addEventListener('click', async function (e) {
    e.preventDefault();

    // 1. Get Category Name
    const categoryName = document.querySelector('input[placeholder="Category Name"]').value;

    // 2. Get Description from Quill editor
    const description = document.querySelector('#editor .ql-editor')?.innerText;

    // 3. Get selected image file
    const imageInput = document.querySelector('.file-input');
    const imageFile = imageInput.files[0];

    // 4. Get Date
    const date = document.querySelector('.flatpickr').value;

    const status = document.querySelector('input[name="inlineRadioOptions"]:checked').nextElementSibling.textContent.trim();

    // Validation
    // if (!categoryName || !description || !imageFile || !date) {
    //    alert('Please fill all required fields.');
    //    return;
    // }

    // Prepare form data
    const formData = new FormData();
    if (status == "Active") {
      formData.append('status', true);
    } else {
      formData.append('status', false);
    }
    formData.append('category_name', categoryName);
    formData.append('description', description);
    formData.append('image', imageFile);
    formData.append('date', date);

    try {
       const response = await fetch('/dashboard/addCategory', {
          method: 'POST',
          body: formData
       });

       const data = await response.json();
       const alertContainer = document.getElementById('alert-container');

         alertContainer.innerHTML = `
         <div class="alert alert-${data.success ? 'success' : 'danger'} mt-3" role="alert">
           ${data.message}
         </div>`

    } catch (error) {
       console.error('Error:', error);
       alert('An error occurred while sending data to the server.');
    }
 });
