document.getElementById('resetForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';
    
      try {
        const response = await fetch('/reset', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();
  
        alertContainer.innerHTML = `
          <div class="alert alert-${result.success ? 'success' : 'danger'} mt-3" role="alert">
            ${result.message}
          </div>
        `;
  
        if (result.success) {
          setTimeout(() => {
            window.location.href = '/login';
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

  