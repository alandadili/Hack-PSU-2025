<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>FitTrack - Mobile App</title>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family:'Poppins', sans-serif;
  }
  body {
    background: #f3f4f6;
  }

  /* Overlay with 9:16 aspect ratio and green background */
  .auth-screen {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #10b981; /* main green background */
    z-index: 999;
  }

  .auth-container {
    width: 90%;
    max-width: 400px;
    aspect-ratio: 9 / 16;
    background: #10b981; /* same green for container */
    border-radius: 30px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    padding: 40px 24px;
    justify-content: space-between;
    color: #fff; /* text color inside container */
  }

  /* Branding header */
  .branding {
    text-align: center;
    margin-bottom: 20px;
  }
  .branding-icon {
    width: 50px;
    height: 50px;
    margin: 0 auto;
    background:#fff; /* white icon background for contrast */
    border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:24px; color:#10b981; font-weight:700;
  }
  .branding h2 {
    margin-top:10px;
    font-weight:700;
    font-size:22px;
    color:#fff; /* white for contrast */
  }

  /* Form styling */
  .form-container {
    flex:1;
    display:flex;
    flex-direction:column;
    justify-content:center;
  }

  #auth-form {
    display:flex;
    flex-direction:column;
    gap:16px;
  }

  /* Input styles */
  #auth-form input,
  #auth-form select {
    padding: 14px 16px;
    border: 1px solid #d1fae5;
    border-radius: 16px;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    background-color: #fff;
    color: #1f2937;
    outline: none;
    width: 100%;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  /* Remove default appearance for select for consistency */
  #additional-fields select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  #auth-form input:focus,
  #auth-form select:focus {
    border-color: #10b981;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.2), 0 0 8px rgba(16, 185, 129, 0.2);
  }

  /* Style button with gradient and hover effects */
  #auth-form button {
    background: linear-gradient(135deg, #2dd4bf, #059669);
    color: #fff;
    padding: 14px;
    border: none;
    border-radius: 16px;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);
    transition: all 0.3s ease;
  }
  #auth-form button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(5, 150, 105, 0.4);
    background: linear-gradient(135deg, #249b8f, #046d52);
  }

  /* Switch link style */
  .switch-link {
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
  }
  .switch-link a {
    color: #fff; /* white links */
    cursor: pointer;
    text-decoration: underline;
  }
</style>
</head>
<body>

<!-- Auth Overlay -->
<div class="auth-screen" id="auth-screen">
  <div class="auth-container" id="auth-container">
    <!-- Branding -->
    <div class="branding">
      <div class="branding-icon">🚀</div>
      <h2>FitTrack</h2>
    </div>
    <!-- Form -->
    <div class="form-container">
      <form id="auth-form" style="display:flex; flex-direction:column; gap:16px;">
        <!-- Full Name for registration only -->
        <div id="name-field" style="display:none;">
          <input type="text" placeholder="Full Name" required />
        </div>
        <!-- Additional fields: Sex and Age for registration only -->
        <div id="additional-fields" style="display:none; flex-direction:column; gap:8px;">
          <select id="sex" required>
            <option value="" disabled selected>Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="number" id="age" placeholder="Age" min="1" max="120" required />
        </div>
        <!-- Common fields -->
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit" id="auth-button">Login</button>
      </form>
    </div>
    <!-- Switch link -->
    <div class="switch-link" id="switch-link">
      <span id="switch-text">Don't have an account? <a id="switch-link-text">Register</a></span>
    </div>
  </div>
</div>

<!-- Main App (hidden initially) -->
<div class="phone-container" id="app-container" style="display:none;">
  <div style="padding:20px; text-align:center;">Main App Content</div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('auth-form');
    const nameField = document.getElementById('name-field');
    const additionalFields = document.getElementById('additional-fields');
    const switchLink = document.getElementById('switch-link'); // declared
    const switchLinkText = document.getElementById('switch-link-text'); // declared
    const switchLinkSpan = document.getElementById('switch-text'); // declared
    const authButton = document.getElementById('auth-button');

    let isRegister = false;

    function toggleMode() {
      isRegister = !isRegister;
      if (isRegister) {
        // Registration mode
        document.getElementById('auth-button').innerText = 'Register';
        nameField.style.display = 'block';
        additionalFields.style.display = 'flex';
        // Update message
        switchLinkSpan.innerHTML = 'Already have an account? <a id="switch-link-text" style="color:#fff; cursor:pointer;">Login</a>';
      } else {
        // Login mode
        document.getElementById('auth-button').innerText = 'Login';
        nameField.style.display = 'none';
        additionalFields.style.display = 'none';
        // Update message
        switchLinkSpan.innerHTML = 'Don\'t have an account? <a id="switch-link-text" style="color:#fff; cursor:pointer;">Register</a>';
      }
      // Re-attach event
      document.getElementById('switch-link-text').addEventListener('click', toggleMode);
      form.reset();
    }

    // Attach initial event
    switchLink.addEventListener('click', toggleMode);
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'switch-link-text') {
        toggleMode();
      }
    });

    // Handle form submit
    document.getElementById('auth-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const sex = document.getElementById('sex') ? document.getElementById('sex').value : '';
      const age = document.getElementById('age') ? document.getElementById('age').value : '';

      // Show main app
      document.getElementById('auth-screen').style.display='none';
      document.getElementById('app-container').style.display='block';

      if (isRegister) {
        console.log('Registration info:', {
          name: document.querySelector('#name-field input').value,
          sex: sex,
          age: age,
          email: document.querySelector('input[type="email"]').value,
        });
      }
    });
  });
</script>

</body>
</html>