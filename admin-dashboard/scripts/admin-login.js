// admin-login.js

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop normal form submit

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        // If everything is filled, then redirect to the dashboard
        window.location.href = "/admin-dashboard/admin-panel.html";
    });
});
