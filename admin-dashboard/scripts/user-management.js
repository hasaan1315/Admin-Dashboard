function filterUsers() {
    let input = document.getElementById("searchUser").value.toLowerCase();
    let rows = document.querySelectorAll("#userTable tr");

    rows.forEach(row => {
        let name = row.cells[0].textContent.toLowerCase();
        let email = row.cells[1].textContent.toLowerCase();

        if (name.includes(input) || email.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
