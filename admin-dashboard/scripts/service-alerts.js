// Top of service-alerts.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDaP4entNTsJPYqwqgaGVR90oYuVL4cWkA",
  authDomain: "metrolink-c82f0.firebaseapp.com",
  projectId: "metrolink-c82f0",
  storageBucket: "metrolink-c82f0.appspot.com",
  messagingSenderId: "588338131354",
  appId: "1:588338131354:web:f1ed0d9cf977210f17ca23",
  measurementId: "G-FPEZGMQ2SN"
};

// ✅ Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Main setup function (exported)
export function initializeServiceAlerts() {
  const titleInput = document.getElementById("alertTitle");
  const messageInput = document.getElementById("alertMessage");
  const scheduleInput = document.getElementById("scheduleTime");

  const sendNowBtn = document.getElementById("sendNowBtn");
  const scheduleBtn = document.getElementById("scheduleBtn");
  const alertsTable = document.getElementById("alertsTable");

  if (!titleInput || !messageInput || !sendNowBtn || !alertsTable) {
    console.error("One or more DOM elements for service alerts not found.");
    return;
  }

  sendNowBtn.addEventListener("click", async () => {
    console.log("Send Now button clicked");
    const title = titleInput.value.trim();
    const message = messageInput.value.trim();

    if (!title || !message) {
      alert("Title and Message are required.");
      return;
    }

    try {
      await addDoc(collection(db, "alerts"), {
        title,
        message,
        timeSent: serverTimestamp(),
        scheduled: false
      });

      alert("Alert sent!");
      titleInput.value = "";
      messageInput.value = "";
      scheduleInput.value = "";
      loadAlerts();
    } catch (err) {
      console.error("Error sending alert:", err);
    }
  });

  // Placeholder for scheduleBtn logic (you can fill in if needed)
  scheduleBtn?.addEventListener("click", async () => {
    console.log("Schedule button clicked");
    const title = titleInput.value.trim();
    const message = messageInput.value.trim();
    const scheduleTime = scheduleInput.value;
  
    if (!title || !message || !scheduleTime) {
      alert("All fields are required to schedule an alert.");
      return;
    }
  
    try {
      await addDoc(collection(db, "alerts"), {
        title,
        message,
        scheduled: true,
        scheduledTime: new Date(scheduleTime),
        createdAt: serverTimestamp()
      });
  
      alert("Alert scheduled!");
      titleInput.value = "";
      messageInput.value = "";
      scheduleInput.value = "";
      loadAlerts();
    } catch (err) {
      console.error("Error scheduling alert:", err);
    }
  });  

  async function loadAlerts() {
    const tbody = alertsTable.querySelector("tbody");
    tbody.innerHTML = ""; // Clear existing rows
  
    try {
      const snapshot = await getDocs(collection(db, "alerts"));
      snapshot.forEach(doc => {
        const data = doc.data();
        const timeSent = data.timeSent?.toDate?.().toLocaleString() || "N/A";
        const scheduledTime = data.scheduledTime?.toDate?.().toLocaleString() || "N/A";
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.title || "No Title"}</td>
          <td>${data.message || "No Message"}</td>
          <td>${timeSent}</td>
          <td>${data.scheduled ? scheduledTime : "-"}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("Error loading alerts:", err);
    }
  }  

  // Load alerts on init
  loadAlerts();
}
