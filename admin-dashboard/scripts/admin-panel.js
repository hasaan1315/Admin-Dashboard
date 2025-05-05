import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaP4entNTsJPYqwqgaGVR90oYuVL4cWkA",
  authDomain: "metrolink-c82f0.firebaseapp.com",
  projectId: "metrolink-c82f0",
  storageBucket: "metrolink-c82f0.appspot.com",
  messagingSenderId: "588338131354",
  appId: "1:588338131354:web:f1ed0d9cf977210f17ca23",
  measurementId: "G-FPEZGMQ2SN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  let contentArea = document.getElementById("content-area");

  if (!contentArea) {
    console.error("Error: 'content-area' div not found! Make sure it exists in admin-panel.html.");
    return;
  }

  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      function check() {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within timeout`));
        } else {
          requestAnimationFrame(check);
        }
      }

      check();
    });
  }

  async function loadPage(page) {
    console.log("Trying to load:", page);

    contentArea.innerHTML = "";

    // Remove existing data-security CSS if any
    const existingDataSecurityLink = document.getElementById("data-security-css");
    if (existingDataSecurityLink) {
      existingDataSecurityLink.remove();
    }

    if (page === "dashboard") {
      console.log("Loading Dashboard...");

      if (document.querySelector("#dashboard-overview")) {
        console.warn("Dashboard already loaded, skipping duplicate insertion.");
        return;
      }

      contentArea.innerHTML = `
        <header>
          <h2 id="dashboard-overview">Overview</h2>
        </header>
        <div class="stats">
          <div class="card">Total Users <span>120</span></div>
          <div class="card">Lost Items <span>45</span></div>
          <div class="card">Service Alerts <span>5</span></div>
          <div class="card">Payments <span>350</span></div>
        </div>
        <div class="charts">
          <canvas id="dataChart"></canvas>
        </div>
      `;

      setTimeout(() => {
        var ctx = document.getElementById('dataChart').getContext('2d');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Users', 'Lost Items', 'Service Alerts', 'Payments'],
            datasets: [{
              data: [120, 45, 5, 350],
              backgroundColor: ['#007bff', '#ffc107', '#dc3545', '#28a745']
            }]
          }
        });
      }, 100);

      return;
    }

    // Add data-security CSS if loading data-security page
    if (page === "data-security") {
      const link = document.createElement("link");
      link.id = "data-security-css";
      link.rel = "stylesheet";
      link.href = "/admin-dashboard/styles/data-security.css";
      document.head.appendChild(link);
    }

    const pageUrl = `./pages/${page}.html?t=${new Date().getTime()}`;
    console.log(`Fetching from: ${pageUrl}`);

    try {
      const response = await fetch(pageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.text();
      contentArea.innerHTML = data;

      if (page === "user-management") {
        await waitForElement("#userTable");
        const module = await import("../scripts/user-management.js");
        const userTable = document.getElementById("userTable");
        if (userTable && module.loadUsers) {
          module.loadUsers(userTable);
        }
      } else if (page === "service-alerts") {
        const module = await import("../scripts/service-alerts.js");
        if (module.initializeServiceAlerts) {
          module.initializeServiceAlerts();
        }
      } else if (page === "virtual-card") {
        const module = await import("../scripts/virtual-card.js");
        if (module && typeof module.initVirtualCardPage === "function") {
          module.initVirtualCardPage();
        }
      } else if (page === "feedback-support") {
        const module = await import("../scripts/feedback-support.js");
        if (module && typeof module.initFeedbackSupport === "function") {
          module.initFeedbackSupport();
        }
      } else if (page === "data-security") {
        const module = await import("../scripts/data-security.js");
        if (module && typeof module.initDataSecurity === "function") {
          module.initDataSecurity();
        }
      }
      
    } catch (error) {
      contentArea.innerHTML = `<p style="color: red;">Error loading page: ${error.message}</p>`;
    }
  }

  window.loadPage = loadPage;

  loadPage('dashboard');
});

window.logout = async function() {
  try {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "adminAccessLogs"), {
        adminId: user.uid,
        email: user.email,
        action: "logout",
        timestamp: serverTimestamp()
      });
    }
    await signOut(auth);
    window.location.href = "/admin-dashboard/pages/admin-login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
}
