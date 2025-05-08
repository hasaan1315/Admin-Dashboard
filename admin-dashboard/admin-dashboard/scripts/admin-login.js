// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, setPersistence, signInWithEmailAndPassword, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase config
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email === "" || password === "") {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Log successful login
      await addDoc(collection(db, "adminAccessLogs"), {
        adminId: user.uid,
        email: user.email,
        action: "login",
        timestamp: serverTimestamp()
      });

      alert("Login successful!");

      // Wait for auth state to be stable before redirect
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setTimeout(() => {
            window.location.href = "/admin-dashboard/admin-panel.html";
          }, 300);
        }
      });

    } catch (error) {
      alert("Login failed: " + error.message);

      try {
        // Log failed login attempt
        await addDoc(collection(db, "adminAccessLogs"), {
          email: email,
          action: "failed-login",
          reason: error.message,
          timestamp: serverTimestamp()
        });
      } catch (logError) {
        console.error("Error logging failed login:", logError);
      }
    }
  });
});
