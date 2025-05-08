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

// ✅ Main setup function
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

  // ✅ Prevent multiple listeners
  sendNowBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    sendNowBtn.disabled = true;

    const title = titleInput.value.trim();
    const message = messageInput.value.trim();

    if (!title || !message) {
      alert("Title and Message are required.");
      sendNowBtn.disabled = false;
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

    sendNowBtn.disabled = false;
  });

  if (scheduleBtn) {
    scheduleBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      scheduleBtn.disabled = true;

      const title = titleInput.value.trim();
      const message = messageInput.value.trim();
      const scheduleTime = scheduleInput.value;

      if (!title || !message || !scheduleTime) {
        alert("All fields are required to schedule an alert.");
        scheduleBtn.disabled = false;
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

      scheduleBtn.disabled = false;
    });
  }

  // ✅ Load existing alerts from Firestore
  async function loadAlerts() {
    const tbody = alertsTable;
    tbody.innerHTML = ""; // Clear previous data to avoid duplication

    try {
      const snapshot = await getDocs(collection(db, "alerts"));
      snapshot.forEach(doc => {
        const data = doc.data();
        const timeSent = data.timeSent?.toDate?.().toLocaleString() || "-";
        const scheduledTime = data.scheduledTime?.toDate?.().toLocaleString() || "-";

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

  // ✅ Initial load
  loadAlerts();
}
