document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Replace 'your-api-endpoint' with the actual API endpoint for user authentication.
    const apiUrl = 'http://localhost:3000/auth/login';
  
    // Make a POST request to the API with the username and password.
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "success") {
        // Redirect to a success page when login is successful.
        window.location.href = 'success.html';
      } else {
        // Display an error message when login fails.
        document.getElementById('message').innerText = 'Invalid username or password. Please try again.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('message').innerText = 'An error occurred during login. Please try again later.';
    });
  });
  