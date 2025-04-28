document.addEventListener("DOMContentLoaded", function () {
    const deleteLogButtons = document.querySelectorAll(".delete-log-btn");
    const backupBtn = document.getElementById("backupDataBtn");

    // Handle Delete Log Button Click
    deleteLogButtons.forEach(button => {
        button.addEventListener("click", function () {
            const row = this.closest("tr");
            row.remove(); // Remove the log entry from the table
        });
    });

    // Handle Data Backup Process
    backupBtn.addEventListener("click", function () {
        alert("Data backup in progress... Please wait.");
        setTimeout(() => {
            alert("Data backup completed successfully!");
        }, 3000); // Simulate backup time
    });

    // Simulate Suspicious Activity Detection & Auto Logout
    function checkSuspiciousActivity() {
        const suspicious = Math.random() < 0.2; // Simulate 20% chance of detection
        if (suspicious) {
            alert("Suspicious activity detected! Logging out...");
            window.location.href = "admin-login.html"; // Redirect to login page
        }
    }

    setInterval(checkSuspiciousActivity, 15000); // Check every 15 seconds
});
