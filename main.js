// ================================
// JOBTRACK APPLICATION TRACKER
// ================================

let applications =
    JSON.parse(localStorage.getItem("jobtrackApplications")) || [];//If saved applications exist → load them.
//If nothing is saved → start with an empty array.


// DOM Elements
const applicationForm = document.getElementById("applicationForm");
const applicationsTable = document.getElementById("applicationsTable");
const emptyState = document.getElementById("emptyState");

const totalApplications = document.getElementById("totalApplications");
const appliedCount = document.getElementById("appliedCount");
const interviewCount = document.getElementById("interviewCount");
const selectedCount = document.getElementById("selectedCount");

// ================================
// LOCAL STORAGE
// ================================

function saveApplications() {

    localStorage.setItem(
        "jobtrackApplications",
        JSON.stringify(applications)
    );

}


// ================================
// ADD APPLICATION
// ================================

applicationForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const company = document.getElementById("company").value.trim();
    const position = document.getElementById("position").value.trim();
    const location = document.getElementById("location").value.trim();
    const appliedDate = document.getElementById("appliedDate").value;
    const status = document.getElementById("status").value;


    const application = {
        id: Date.now(),
        company: company,
        position: position,
        location: location,
        appliedDate: appliedDate,
        status: status
    };


   applications.push(application);

    saveApplications();

    renderApplications();

    updateStatistics();


    // Reset form
    applicationForm.reset();


    // Close modal
    const modalElement = document.getElementById("applicationModal");

    const modal =
        bootstrap.Modal.getInstance(modalElement);

    modal.hide();

});


// ================================
// DISPLAY APPLICATIONS
// ================================

function renderApplications() {

    applicationsTable.innerHTML = "";


    if (applications.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    applications.forEach(function (application) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${application.company}</strong>
            </td>

            <td>
                ${application.position}
            </td>

            <td>
                ${application.location}
            </td>

            <td>
                ${formatDate(application.appliedDate)}
            </td>

            <td>
                <span class="status-badge ${getStatusClass(application.status)}">
                    ${application.status}
                </span>
            </td>

            <td>

                <button
                    class="btn btn-sm btn-outline-primary me-1"
                    onclick="editApplication(${application.id})">

                    <i class="bi bi-pencil"></i>

                </button>


                <button
                    class="btn btn-sm btn-outline-danger"
                    onclick="deleteApplication(${application.id})">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        `;


        applicationsTable.appendChild(row);

    });

}


// ================================
// UPDATE STATISTICS
// ================================

function updateStatistics() {

    totalApplications.textContent =
        applications.length;


    const applied =
        applications.filter(
            app => app.status === "Applied"
        ).length;


    const interviews =
        applications.filter(
            app => app.status === "Interview"
        ).length;


    const selected =
        applications.filter(
            app => app.status === "Selected"
        ).length;


    appliedCount.textContent = applied;

    interviewCount.textContent = interviews;

    selectedCount.textContent = selected;

}


// ================================
// FORMAT DATE
// ================================

function formatDate(date) {

    if (!date) return "";

    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    return new Date(date).toLocaleDateString(
        "en-GB",
        options
    );

}


// ================================
// STATUS STYLE
// ================================

function getStatusClass(status) {

    switch (status) {

        case "Applied":
            return "status-applied";

        case "Interview":
            return "status-interview";

        case "Selected":
            return "status-selected";

        case "Rejected":
            return "status-rejected";

        default:
            return "";

    }

}


// ================================
// DELETE APPLICATION
// ================================

function deleteApplication(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
        return;
    }

    const index = applications.findIndex(
        app => app.id === id
    );

    if (index !== -1) {
        applications.splice(index, 1);
    }

    saveApplications();

    renderApplications();
    updateStatistics();
}

// ================================
// EDIT APPLICATION
// ================================

function editApplication(id) {

    const application =
        applications.find(
            app => app.id === id
        );


    if (!application) return;


    document.getElementById("company").value =
        application.company;

    document.getElementById("position").value =
        application.position;

    document.getElementById("location").value =
        application.location;

    document.getElementById("appliedDate").value =
        application.appliedDate;

    document.getElementById("status").value =
        application.status;


    // Remove old application
    applications =
        applications.filter(
            app => app.id !== id
        );

    saveApplications();

    // Open modal
    const modalElement =
        document.getElementById("applicationModal");

    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );

    modal.show();

}
// ================================
// SAVE APPLICATIONS TO LOCAL STORAGE
// ================================
function saveApplications() {
    localStorage.setItem(
        "jobtrackApplications",
        JSON.stringify(applications)
    );
}
// ================================
// Load the applications when the page opens
// ================================
renderApplications();
updateStatistics();
// ================================
// INITIALIZE APPLICATIONS
// ================================

renderApplications();
updateStatistics();
// ================================
// DARK / LIGHT THEME
// ================================

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");


// Load saved theme
const savedTheme = localStorage.getItem("jobtrackTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeIcon.classList.remove("bi-moon-fill");
    themeIcon.classList.add("bi-sun-fill");

}


// Toggle theme
themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");


    if (isDark) {

        localStorage.setItem(
            "jobtrackTheme",
            "dark"
        );

        themeIcon.classList.remove(
            "bi-moon-fill"
        );

        themeIcon.classList.add(
            "bi-sun-fill"
        );

    } else {

        localStorage.setItem(
            "jobtrackTheme",
            "light"
        );

        themeIcon.classList.remove(
            "bi-sun-fill"
        );

        themeIcon.classList.add(
            "bi-moon-fill"
        );

    }

});

