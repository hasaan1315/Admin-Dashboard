import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration
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

// Main function to load feedback and bind events
export async function initFeedbackSupport() {
  const tableBody = document.getElementById("feedbackTableBody");
  if (!tableBody) {
    console.error("Element with ID 'feedbackTableBody' not found.");
    return;
  }

  tableBody.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "feedbackSupport"));
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docRef = docSnap.ref;

      var statusClass = data.status === 'resolved' ? 'resolved' : 'pending';
      var statusText = capitalize(data.status);

      var row = document.createElement("tr");
      row.innerHTML = "<td>" + data.userName + "</td>" +
                      "<td>" + (data.email || '') + "</td>" +
                      "<td>" + data.message + "</td>" +
                      "<td><span class='status " + statusClass + "'>" + statusText + "</span></td>" +
                      "<td>" +
                        "<button class='resolve-btn' " + (data.status === "resolved" ? "disabled" : "") + ">Resolve</button>" +
                        "<button class='delete-btn'>Delete</button>" +
                      "</td>";

      // Event: Resolve
      const resolveBtn = row.querySelector(".resolve-btn");
      resolveBtn.addEventListener("click", async () => {
        try {
          // Add notification document to notify user
          if (data.email) {
            await addDoc(collection(db, "notifications"), {
              email: data.email,
              message: "Your issue has been resolved by the admin.",
              timestamp: serverTimestamp(),
              read: false
            });
          }

          // Update feedback status to resolved
          await updateDoc(docRef, { status: "resolved" });
          row.querySelector("span").textContent = "Resolved";
          row.querySelector("span").className = "status resolved";
          resolveBtn.disabled = true;
        } catch (error) {
          console.error("Error resolving feedback and sending notification:", error);
        }
      });

      // Event: Delete
      const deleteBtn = row.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", async () => {
        await deleteDoc(docRef);
        row.remove();
      });

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading feedback:", error);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
