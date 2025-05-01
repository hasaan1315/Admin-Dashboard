// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase config
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
const db = getFirestore(app);

console.log("user-management.js loaded");

// Load users when page is ready
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded event fired");
  const userTable = document.getElementById("userTable");

  try {
    console.log("Fetching users from Firestore...");
    const querySnapshot = await getDocs(collection(db, "users"));
    console.log(`Fetched ${querySnapshot.size} users`);

    if (querySnapshot.empty) {
      userTable.innerHTML = `<tr><td colspan="4">No users found.</td></tr>`;
      return;
    }

    querySnapshot.forEach(doc => {
      const user = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name || 'N/A'}</td>
        <td>${user.email || 'N/A'}</td>
        <td><span class="status active">Active</span></td>
        <td><button class="deactivate-btn">Deactivate</button></td>
      `;
      userTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    userTable.innerHTML = `<tr><td colspan="4">Error loading users.</td></tr>`;
  }
});

// Filter users
window.filterUsers = function () {
  const input = document.getElementById("searchUser").value.toLowerCase();
  const rows = document.querySelectorAll("#userTable tr");

  rows.forEach(row => {
    const name = row.cells[0].textContent.toLowerCase();
    const email = row.cells[1].textContent.toLowerCase();
    row.style.display = (name.includes(input) || email.includes(input)) ? "" : "none";
  });
};
