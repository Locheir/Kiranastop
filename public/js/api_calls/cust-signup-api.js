document.getElementById('userForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  data.role = 'customer';

  const alertContainer = document.getElementById('alert-container');
  alertContainer.innerHTML = ''; // clear any previous alerts

  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (pos) => {
    data.location = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };

    try {
      const response = await fetch('/signup/createuser', {
        method: 'POST',
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
        // New user created, redirect to welcome page
        setTimeout(() => {
          window.location.href = '/home'; // replace with your page
        }, 1000);
      } else if (result.message && result.message.toLowerCase().includes('already exists')) {
        // User already exists, redirect to login page
        setTimeout(() => {
          window.location.href = '/login'; // replace with your page
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
  }, (err) => {
    alertContainer.innerHTML = `
      <div class="alert alert-danger mt-3" role="alert">
        Could not get location: ${err.message}
      </div>
    `;
  });
});
