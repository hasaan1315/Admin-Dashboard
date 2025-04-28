// admin-login.js

// Your Firebase Config (same as in signup)
const firebaseConfig = {
    apiKey: "AIzaSyDaP4entNTsJPYqwqgaGVR90oYuVL4cWkA",
    authDomain: "metrolink-c82f0.firebaseapp.com",
    projectId: "metrolink-c82f0",
    storageBucket: "metrolink-c82f0.appspot.com",
    messagingSenderId: "588338131354",
    appId: "1:588338131354:web:f1ed0d9cf977210f17ca23",
    measurementId: "G-FPEZGMQ2SN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        // Log in the user using Firebase Authentication
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login successful
                alert("Login successful!");
                window.location.href = "/admin-dashboard/admin-panel.html"; // Go to dashboard
            })
            .catch((error) => {
                // Handle Errors
                alert(error.message);
            });
    });
});
