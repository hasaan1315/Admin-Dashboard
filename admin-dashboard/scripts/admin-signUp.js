// admin-signUp.js

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting normally

        const adminId = document.getElementById('admin_id').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (adminId === "" || email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        // If everything is filled, then redirect to login
        window.location.href = "admin-login.html";
    });
});
