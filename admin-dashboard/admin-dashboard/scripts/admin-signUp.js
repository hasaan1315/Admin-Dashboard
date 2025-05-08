// admin-signUp.js

// Your Firebase Config (copy from your project)
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

        // Sign up the user with Firebase Authentication
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed up successfully
                alert("Signup successful!");
                window.location.href = "admin-login.html"; // Redirect to login page
            })
            .catch((error) => {
                // Handle Errors
                alert(error.message);
            });
    });
});
