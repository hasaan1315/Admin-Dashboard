import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Exported function to initialize the virtual card page
export async function initVirtualCardPage() {
  const tableBody = document.getElementById("virtualCardsTableBody");
  const searchInput = document.getElementById("searchCard");

  if (!tableBody || !searchInput) {
    console.error("Missing DOM elements: check HTML structure.");
    return;
  }

  async function loadCards() {
    tableBody.innerHTML = "";
  
    const querySnapshot = await getDocs(collection(db, "virtualCards"));
    querySnapshot.forEach((docSnap) => {
      const card = docSnap.data();
      const cardRef = docSnap.ref;
  
      const row = document.createElement("tr");
      const buttonText = card.status === "blocked" ? "Unblock Card" : "Block Card";
      const buttonColor = buttonText === "Block Card" ? "red" : "green";

      row.innerHTML = `
        <td>${card.cardId || "N/A"}</td>
        <td>$${card.balance?.toFixed(2) || "0.00"}</td>
        <td>${card.expiryDate || "N/A"}</td>
        <td>${card.cvc || "N/A"}</td>
        <td><span class="card-status ${card.status === "blocked" ? "blocked" : "active"}">
          ${card.status || "active"}
        </span></td>
        <td>
          <button class="blockBtn" style="background-color: ${buttonColor}; color: white;">
            ${buttonText}
          </button>
        </td>
      `;
      tableBody.appendChild(row);
  
      const blockBtn = row.querySelector(".blockBtn");
      blockBtn.addEventListener("click", async () => {
        const newStatus = card.status === "blocked" ? "active" : "blocked";
  
        try {
          await updateDoc(cardRef, { status: newStatus });
  
          // Update local card object
          card.status = newStatus;
  
          // Update status badge
          const statusSpan = row.querySelector(".card-status");
          statusSpan.textContent = newStatus;
          statusSpan.classList.remove("active", "blocked");
          statusSpan.classList.add(newStatus);
  
          // Update button label and color
          const newButtonText = newStatus === "blocked" ? "Unblock Card" : "Block Card";
          const newButtonColor = newButtonText === "Block Card" ? "red" : "green";
          blockBtn.textContent = newButtonText;
          blockBtn.style.backgroundColor = newButtonColor;
          blockBtn.style.color = "white";
        } catch (error) {
          console.error("Error updating card status:", error);
        }
      });
    });
  }
  
  // Search filter
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const cardId = row.cells[0].textContent.toLowerCase();
      const balance = row.cells[1].textContent.toLowerCase();
      row.style.display = cardId.includes(query) || balance.includes(query) ? "" : "none";
    });
  });

  await loadCards();
}
