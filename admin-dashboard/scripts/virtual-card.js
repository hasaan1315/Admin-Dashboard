document.addEventListener("DOMContentLoaded", function () {

    let searchInput = document.getElementById("searchCard");
    let tableRows = document.querySelectorAll("tbody tr");

    // Function to filter table based on search input
    searchInput.addEventListener("input", function () {
        let query = searchInput.value.toLowerCase();

        tableRows.forEach(row => {
            let cardNumber = row.cells[0].textContent.toLowerCase();
            let userName = row.cells[1].textContent.toLowerCase();

            if (cardNumber.includes(query) || userName.includes(query)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    // Function to block a card
    document.querySelectorAll(".blockBtn").forEach(button => {
        button.addEventListener("click", function () {
            let row = this.closest("tr");
            let statusCell = row.cells[4];

            if (statusCell.textContent === "Active") {
                statusCell.textContent = "Blocked";
                this.textContent = "Blocked";
                this.disabled = true;
                this.style.background = "#777"; // Change button style when disabled
            }
        });
    });
});
