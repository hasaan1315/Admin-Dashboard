document.addEventListener("DOMContentLoaded", function () {
    const resolveButtons = document.querySelectorAll(".resolve-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    // Handle Resolve Button Click
    resolveButtons.forEach(button => {
        button.addEventListener("click", function () {
            const row = this.closest("tr"); // Get the parent row
            const statusCell = row.querySelector(".status");

            // Update status
            statusCell.textContent = "Resolved";
            statusCell.classList.remove("pending");
            statusCell.classList.add("resolved");

            // Disable the resolve button after resolving
            this.disabled = true;
        });
    });

    // Handle Delete Button Click
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const row = this.closest("tr");
            row.remove(); // Remove the row from the table
        });
    });
});
