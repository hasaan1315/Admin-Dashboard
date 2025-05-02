// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// Utility: Wait for element
function waitForElement(selector, callback, interval = 100, timeout = 5000) {
  const startTime = Date.now();

  const check = () => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else if (Date.now() - startTime < timeout) {
      setTimeout(check, interval);
    } else {
      console.error(`Element '${selector}' not found within ${timeout}ms.`);
    }
  };

  check();
}

// Load users from Firestore and populate table
export async function loadUsers(userTable) {
  try {
    console.log("Fetching users from Firestore...");
    const querySnapshot = await getDocs(collection(db, "users"));
    console.log(`Fetched ${querySnapshot.size} users`);

    if (querySnapshot.empty) {
      userTable.innerHTML = `<tr><td colspan="4">No users found.</td></tr>`;
      return;
    }

    userTable.innerHTML = ""; // Clear existing rows before appending

    querySnapshot.forEach(docSnap => {
      const user = docSnap.data();
      const userId = docSnap.id;
      const currentStatus = user.status || 'Active';

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.name || 'N/A'}</td>
        <td>${user.email || 'N/A'}</td>
        <td><span class="status ${currentStatus.toLowerCase()}">${currentStatus}</span></td>
        <td><button class="status-btn" onclick="toggleStatus('${userId}', this)">${currentStatus === 'Active' ? 'Deactivate' : 'Activate'}</button></td>
      `;
      userTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    userTable.innerHTML = `<tr><td colspan="4">Error loading users.</td></tr>`;
  }
}
document.getElementById("userManagementBtn")?.addEventListener("click", () => {
  const userTable = document.getElementById("userTable");
  if (userTable) {
    userTable.innerHTML = ""; // clear old rows to avoid duplicates
    loadUsers(userTable);
  }
});

// Toggle user status in Firestore and update UI
window.toggleStatus = async function (userId, button) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const currentStatus = userSnap.data().status || "Active";
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      await updateDoc(userRef, {
        status: newStatus
      });

      // Update UI
      const statusCell = button.parentNode.previousElementSibling;
      statusCell.innerHTML = `<span class="status ${newStatus.toLowerCase()}">${newStatus}</span>`;
      button.innerText = newStatus === "Active" ? "Deactivate" : "Activate";
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  }
};

// Filter users by name or email
window.filterUsers = function () {
  const input = document.getElementById("searchUser").value.toLowerCase();
  const rows = document.querySelectorAll("#userTable tr");

  rows.forEach(row => {
    const name = row.cells[0]?.textContent.toLowerCase() || "";
    const email = row.cells[1]?.textContent.toLowerCase() || "";
    row.style.display = (name.includes(input) || email.includes(input)) ? "" : "none";
  });
};

// Start when table is available
waitForElement("#userTable", (userTable) => {
  loadUsers(userTable);
});
