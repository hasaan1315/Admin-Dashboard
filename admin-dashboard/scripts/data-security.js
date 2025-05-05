import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDaP4entNTsJPYqwqgaGVR90oYuVL4cWkA",
  authDomain: "metrolink-c82f0.firebaseapp.com",
  projectId: "metrolink-c82f0",
  storageBucket: "metrolink-c82f0.appspot.com",
  messagingSenderId: "588338131354",
  appId: "1:588338131354:web:f1ed0d9cf977210f17ca23",
  measurementId: "G-FPEZGMQ2SN"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async function () {
  const logTable = document.getElementById("logTable");
  const backupBtn = document.getElementById("backupDataBtn");

  // Load logs from Firestore
  async function loadLogs() {
    logTable.innerHTML = "";

    const snapshot = await getDocs(collection(db, "adminAccessLogs"));
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const date = data.timestamp?.toDate().toLocaleString() || "N/A";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${date}</td>
        <td>${data.action}</td>
        <td>${data.email}</td>
        <td><button class="delete-log-btn">Delete</button></td>
      `;

      // Delete Firestore doc + remove row
      row.querySelector(".delete-log-btn").addEventListener("click", async () => {
        await deleteDoc(doc(db, "adminAccessLogs", docSnap.id));
        row.remove();
      });

      logTable.appendChild(row);
    });
  }

  await loadLogs();

  // Backup to CSV
  backupBtn.addEventListener("click", async () => {
    alert("Data backup in progress... Please wait.");

    const snapshot = await getDocs(collection(db, "adminAccessLogs"));
    let csvContent = "DateTime,Action,Email\n";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const date = data.timestamp?.toDate().toLocaleString() || "N/A";
      csvContent += `"${date}","${data.action}","${data.email}"\n`;
    });

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "admin_access_logs.csv";
    downloadLink.click();

    alert("Data backup completed successfully!");
  });

  // Suspicious activity detection
  function checkSuspiciousActivity() {
    const suspicious = Math.random() < 0.2; // 20% chance
    if (suspicious) {
      alert("Suspicious activity detected! Logging out...");
      window.location.href = "admin-login.html";
    }
  }

  setInterval(checkSuspiciousActivity, 15000); // Every 15s
});
