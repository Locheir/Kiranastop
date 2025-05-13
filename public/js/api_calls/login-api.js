document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';
  
      try {
        const response = await fetch('/loginin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        console.log("here2");
        const result = await response.json();
  
        alertContainer.innerHTML = `
          <div class="alert alert-${result.success ? 'success' : 'danger'} mt-3" role="alert">
            ${result.message}
          </div>
        `;
  
        if (result.success) {
          setTimeout(() => {
            if (result.role == 'customer') {
              window.location.href = '/home';
            } else if (result.role == 'shopkeeper') {
              window.location.href = '/dashboard';
            } else {
              window.location.href = '/';
            }
          }, 1000);
        }
  
      } catch (error) {
        alertContainer.innerHTML = `
          <div class="alert alert-danger mt-3" role="alert">
            An error occurred. Please try again.
          </div>
        `;
        console.error('Error:', error);
      }
});

  