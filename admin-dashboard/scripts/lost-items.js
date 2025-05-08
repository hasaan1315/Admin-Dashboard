import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

let contentArea = null;
let listenersAttached = false;

// Fetch and display lost items from Firestore
async function fetchLostItems() {
  const lostItemsTable = document.getElementById("lostItemsTable");
  lostItemsTable.innerHTML = "";
  console.log("Fetching lost items from Firestore...");

  try {
    const querySnapshot = await getDocs(collection(db, "LostItems"));
    console.log("Query snapshot size:", querySnapshot.size);

    if (querySnapshot.empty) {
      console.log("No lost items found in Firestore.");
    }

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;
      const status = (data.status || 'pending').toLowerCase();
      console.log("Lost item document:", docId, data);

      const row = document.createElement("tr");

      if (status === 'pending') {
        row.innerHTML = "<td>" + docId + "</td>" +
                        "<td>" + (data.email || 'N/A') + "</td>" +
                        "<td>" + (data.itemDescription || 'N/A') + "</td>" +
                        "<td>" + (data.location || 'N/A') + "</td>" +
                        "<td><span class='status " + status + "'>" + (data.status || 'Pending') + "</span></td>" +
                        "<td><button class='resolve-btn'>Mark as Found</button></td>";
      } else {
        row.innerHTML = "<td>" + docId + "</td>" +
                        "<td>" + (data.email || 'N/A') + "</td>" +
                        "<td>" + (data.itemDescription || 'N/A') + "</td>" +
                        "<td>" + (data.location || 'N/A') + "</td>" +
                        "<td><span class='status resolved'>Resolved</span></td>" +
                        "<td><button class='resolve-btn found-btn' disabled style='background-color: rgb(255, 0, 0); color: white;'>Item Found</button></td>";
      }

      lostItemsTable.appendChild(row);

      if (status === 'pending') {
        const resolveBtn = row.querySelector(".resolve-btn");
        resolveBtn.addEventListener("click", async () => {
          try {
            if (data.email) {
              await addDoc(collection(db, "notifications"), {
                email: data.email,
                message: "Your lost item has been marked as found by the admin.",
                timestamp: serverTimestamp(),
                read: false
              });
            }

            const docRef = doc(db, "LostItems", docId);
            await updateDoc(docRef, { status: "resolved" });

            const statusSpan = row.querySelector(".status");
            statusSpan.classList.remove("pending");
            statusSpan.classList.add("resolved");
            statusSpan.textContent = "Resolved";

            resolveBtn.textContent = "Item Found";
            resolveBtn.style.backgroundColor = "rgb(255, 0, 0)";
            resolveBtn.style.color = "white";
            resolveBtn.classList.add("found-btn");
            resolveBtn.classList.remove("resolve-btn");
            resolveBtn.disabled = true;
          } catch (error) {
            console.error("Error updating lost item status and sending notification:", error);
          }
        });
      }
    });
  } catch (error) {
    console.error("Error fetching lost items:", error);
  }
}

// Attach event delegation for button clicks on content area
function attachButtonListeners() {
  if (!contentArea) {
    contentArea = document.getElementById("content-area");
  }
  if (listenersAttached) {
    console.log("Button listeners already attached");
    return;
  }
  console.log("Attaching button listeners with event delegation on content area");
  contentArea.addEventListener("click", function(event) {
    const target = event.target;
    if (target.classList.contains("resolve-btn")) {
      console.log("Resolve button clicked");
      const row = target.closest("tr");
      const docId = row.cells[0].textContent;
      updateStatus(docId, "resolved", row, target);
    }
  });
  listenersAttached = true;
}

// Update the lost item status in Firestore
async function updateStatus(docId, newStatus, row, button) {
  try {
    console.log("Updating status for docId:", docId, "to", newStatus);
    const docRef = doc(db, "LostItems", docId);
    await updateDoc(docRef, { status: newStatus });

    const statusSpan = row.querySelector(".status");
    statusSpan.classList.remove("pending");
    statusSpan.classList.add("resolved");
    statusSpan.textContent = "Resolved";

    if (button) {
      button.textContent = "Item Found";
      button.style.backgroundColor = "rgb(255, 0, 0)"; // red color
      button.style.color = "white";
      button.classList.add("found-btn");
      button.classList.remove("resolve-btn");
      button.disabled = true;
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
}

// Search filter function
function filterLostItems() {
  const input = document.getElementById("searchLostItem").value.toLowerCase();
  const rows = document.querySelectorAll("#lostItemsTable tr");

  rows.forEach(row => {
    const user = row.cells[1].textContent.toLowerCase();
    const item = row.cells[2].textContent.toLowerCase();
    row.style.display = user.includes(input) || item.includes(input) ? "" : "none";
  });
}

// Initialization function to be called from admin-panel.js
export function initLostItems() {
  console.log("Initializing lost items page");
  attachButtonListeners();
  fetchLostItems();
  window.filterLostItems = filterLostItems;
}
