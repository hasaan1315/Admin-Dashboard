document.addEventListener("DOMContentLoaded", function () {
    let sendNowBtn = document.getElementById("sendNowBtn");
    let scheduleBtn = document.getElementById("scheduleBtn");
    let alertTitle = document.getElementById("alertTitle");
    let alertMessage = document.getElementById("alertMessage");
    let scheduleTime = document.getElementById("scheduleTime");
    let alertsTable = document.getElementById("alertsTable");

    // Function to add an alert to the table
    function addAlertToTable(title, message, time) {
        let newRow = document.createElement("tr");
        newRow.innerHTML = `<td>${title}</td><td>${message}</td><td>${time}</td>`;
        alertsTable.appendChild(newRow);
    }

    // Send Now Button Click Event
    sendNowBtn.addEventListener("click", function () {
        let title = alertTitle.value.trim();
        let message = alertMessage.value.trim();

        if (title === "" || message === "") {
            alert("Please enter both title and message!");
            return;
        }

        let currentTime = new Date().toLocaleString(); // Get current date and time
        addAlertToTable(title, message, currentTime);

        // Clear input fields
        alertTitle.value = "";
        alertMessage.value = "";
        scheduleTime.value = "";
        
        alert("Alert sent successfully!");
    });

    // Schedule Button Click Event
    scheduleBtn.addEventListener("click", function () {
        let title = alertTitle.value.trim();
        let message = alertMessage.value.trim();
        let schedule = scheduleTime.value;

        if (title === "" || message === "" || schedule === "") {
            alert("Please enter title, message, and schedule time!");
            return;
        }

        addAlertToTable(title, message, schedule);
        
        // Clear input fields
        alertTitle.value = "";
        alertMessage.value = "";
        scheduleTime.value = "";

        alert("Alert scheduled successfully!");
    });
});
