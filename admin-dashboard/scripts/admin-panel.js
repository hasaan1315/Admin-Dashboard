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
    
        // Clear previous content
        contentArea.innerHTML = "";
    
        // If Dashboard is clicked, load it manually
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
    
            return; // Stop further execution
        }
    
        // Dynamically fetch page content
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
                    module.initializeServiceAlerts(); // ✅ this calls the setup code manually
                }
            }else if (page === "virtual-card") {
                const module = await import("../scripts/virtual-card.js");
                if (module && typeof module.initVirtualCardPage === "function") {
                    module.initVirtualCardPage(); // manually run setup
                }
            }
            
        } catch (error) {
            contentArea.innerHTML = `<p style="color: red;">Error loading page: ${error.message}</p>`;
        }
    }
  
    // Attach globally
    window.loadPage = loadPage;

    // Load Dashboard by default
    loadPage('dashboard');
});

    // Redirect to login page
    function logout() {
        window.location.href = "/admin-dashboard/pages/admin-login.html"; // no typos or spaces
    }
    

