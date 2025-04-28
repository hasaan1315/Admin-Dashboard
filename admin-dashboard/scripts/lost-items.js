// Function to filter lost items by user or item description
function filterLostItems() {
    let input = document.getElementById("searchLostItem").value.toLowerCase();
    let rows = document.querySelectorAll("#lostItemsTable tr");

    rows.forEach(row => {
        let user = row.cells[1].textContent.toLowerCase();
        let item = row.cells[2].textContent.toLowerCase();
        if (user.includes(input) || item.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

// Function to mark an item as "Found" or "Not Found"
document.querySelectorAll(".found-btn").forEach(button => {
    button.addEventListener("click", function () {
        let row = this.closest("tr");
        row.querySelector(".status").textContent = "Resolved";
        row.querySelector(".status").classList.remove("pending");
        row.querySelector(".status").classList.add("resolved");
        this.disabled = true;
        row.querySelector(".not-found-btn").disabled = true;
    });
});

document.querySelectorAll(".not-found-btn").forEach(button => {
    button.addEventListener("click", function () {
        let row = this.closest("tr");
        row.querySelector(".status").textContent = "Not Found";
        row.querySelector(".status").classList.remove("pending");
        row.querySelector(".status").classList.add("resolved");
        this.disabled = true;
        row.querySelector(".found-btn").disabled = true;
    });
});
