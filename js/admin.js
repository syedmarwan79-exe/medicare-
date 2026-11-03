/* ==========================================================================
   MediCare+ 2.0 - Hospital Admin Panel Logic
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initAdminPanel();
});

// Primary Storage Keys
const APPOINTMENTS_KEY = "medicare_appointments_v2";
const LAB_BOOKINGS_KEY = "medicare_lab_bookings_v2";

// Default Doctors Data
let adminDoctors = [
    { id: 1, name: "Dr. Rahul Sharma", spec: "Cardiology", exp: "12+ Years", fee: 800, timing: "10:00 AM - 04:00 PM" },
    { id: 2, name: "Dr. Priya Mehta", spec: "Neurology", exp: "10+ Years", fee: 1000, timing: "11:00 AM - 05:00 PM" },
    { id: 3, name: "Dr. Amit Verma", spec: "Orthopedics", exp: "15+ Years", fee: 750, timing: "09:00 AM - 02:00 PM" },
    { id: 4, name: "Dr. Neha Singh", spec: "Dentistry", exp: "8+ Years", fee: 500, timing: "10:00 AM - 06:00 PM" },
    { id: 5, name: "Dr. Arjun Kapoor", spec: "Pediatrics", exp: "11+ Years", fee: 650, timing: "09:30 AM - 03:30 PM" },
    { id: 6, name: "Dr. Sneha Gupta", spec: "General Medicine", exp: "9+ Years", fee: 400, timing: "08:00 AM - 08:00 PM" }
];

function initAdminPanel() {
    renderStats();
    renderAppointmentsTable();
    renderLabTable();
    renderDoctorsGrid();
    setupTabSwitching();
    setupSearchFilter();
    setupModalEvents();
}

/* --------------------------------------------------------------------------
   1. STATS CALCULATION
   -------------------------------------------------------------------------- */
function renderStats() {
    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY)) || [];
    const labBookings = JSON.parse(localStorage.getItem(LAB_BOOKINGS_KEY)) || [];

    // Revenue calculation
    let apptRevenue = appointments.reduce((sum, item) => sum + (parseInt(item.fee) || 600), 0);
    let labRevenue = labBookings.reduce((sum, item) => sum + (parseInt(item.price) || 500), 0);
    let totalRev = apptRevenue + labRevenue;

    document.getElementById("statTotalRevenue").textContent = `₹${totalRev.toLocaleString('en-IN')}`;
    document.getElementById("statAppointments").textContent = appointments.length;
    document.getElementById("statLabBookings").textContent = labBookings.length;
    document.getElementById("statDoctors").textContent = adminDoctors.length;
}

/* --------------------------------------------------------------------------
   2. APPOINTMENTS TABLE RENDER & ACTIONS
   -------------------------------------------------------------------------- */
function renderAppointmentsTable(filterText = "") {
    const tbody = document.getElementById("appointmentsTableBody");
    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY)) || [];

    if (appointments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-table-msg"><i class="fa-solid fa-folder-open"></i> No patient appointments found in database.</td></tr>`;
        return;
    }

    let filtered = appointments.filter(app => {
        const text = (app.patientName + " " + app.doctor + " " + app.specialization + " " + app.id).toLowerCase();
        return text.includes(filterText.toLowerCase());
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-table-msg">No matching appointments found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(app => {
        const statusClass = (app.status || "Confirmed").toLowerCase();
        const isEmergency = app.isEmergency ? `<span class="badge-emergency"><i class="fa-solid fa-triangle-exclamation"></i> YES</span>` : `<span style="color:#94a3b8;">No</span>`;

        return `
            <tr>
                <td><strong>#${app.id.substring(0, 8)}</strong></td>
                <td><strong>${app.patientName}</strong><br><small style="color:#64748b;">${app.phone || 'N/A'}</small></td>
                <td>${app.doctor}</td>
                <td>${app.specialization || 'General'}</td>
                <td>${app.date}<br><small style="color:#64748b;">${app.time}</small></td>
                <td>${isEmergency}</td>
                <td><span class="badge-status ${statusClass}">${app.status || 'Confirmed'}</span></td>
                <td>
                    ${app.status !== 'Completed' ? `<button class="btn-action-sm btn-complete" onclick="updateApptStatus('${app.id}', 'Completed')"><i class="fa-solid fa-check"></i> Complete</button>` : ''}
                    ${app.status !== 'Cancelled' ? `<button class="btn-action-sm btn-cancel-act" onclick="updateApptStatus('${app.id}', 'Cancelled')"><i class="fa-solid fa-xmark"></i> Cancel</button>` : ''}
                    <button class="btn-action-sm btn-delete" onclick="deleteAppt('${app.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

window.updateApptStatus = function(id, newStatus) {
    let appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY)) || [];
    let item = appointments.find(a => a.id === id);
    if (item) {
        item.status = newStatus;
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        renderAppointmentsTable();
        renderStats();
    }
};

window.deleteAppt = function(id) {
    if (confirm("Are you sure you want to delete this appointment entry?")) {
        let appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY)) || [];
        appointments = appointments.filter(a => a.id !== id);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        renderAppointmentsTable();
        renderStats();
    }
};

/* --------------------------------------------------------------------------
   3. LAB BOOKINGS TABLE RENDER & ACTIONS
   -------------------------------------------------------------------------- */
function renderLabTable(filterText = "") {
    const tbody = document.getElementById("labTableBody");
    const labBookings = JSON.parse(localStorage.getItem(LAB_BOOKINGS_KEY)) || [];

    if (labBookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-table-msg"><i class="fa-solid fa-flask"></i> No diagnostic lab requests found.</td></tr>`;
        return;
    }

    let filtered = labBookings.filter(lab => {
        const text = (lab.patientName + " " + lab.testName + " " + lab.category + " " + lab.id).toLowerCase();
        return text.includes(filterText.toLowerCase());
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-table-msg">No matching lab requests found.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(lab => {
        const statusClass = (lab.status || "Pending").toLowerCase();

        return `
            <tr>
                <td><strong>#${lab.id.substring(0, 8)}</strong></td>
                <td><strong>${lab.patientName}</strong><br><small style="color:#64748b;">${lab.phone || 'N/A'}</small></td>
                <td>${lab.testName}</td>
                <td><span class="badge-status" style="background:#f1f5f9; color:#475569;">${lab.category || 'Diagnostic'}</span></td>
                <td><strong>₹${lab.price}</strong></td>
                <td>${lab.date}</td>
                <td><span class="badge-status ${statusClass}">${lab.status || 'Pending'}</span></td>
                <td>
                    ${lab.status !== 'Completed' ? `<button class="btn-action-sm btn-complete" onclick="updateLabStatus('${lab.id}', 'Completed')"><i class="fa-solid fa-circle-check"></i> Sample Done</button>` : ''}
                    <button class="btn-action-sm btn-delete" onclick="deleteLab('${lab.id}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

window.updateLabStatus = function(id, newStatus) {
    let labBookings = JSON.parse(localStorage.getItem(LAB_BOOKINGS_KEY)) || [];
    let item = labBookings.find(l => l.id === id);
    if (item) {
        item.status = newStatus;
        localStorage.setItem(LAB_BOOKINGS_KEY, JSON.stringify(labBookings));
        renderLabTable();
        renderStats();
    }
};

window.deleteLab = function(id) {
    if (confirm("Delete this diagnostic test request?")) {
        let labBookings = JSON.parse(localStorage.getItem(LAB_BOOKINGS_KEY)) || [];
        labBookings = labBookings.filter(l => l.id !== id);
        localStorage.setItem(LAB_BOOKINGS_KEY, JSON.stringify(labBookings));
        renderLabTable();
        renderStats();
    }
};

/* --------------------------------------------------------------------------
   4. DOCTORS GRID RENDER
   -------------------------------------------------------------------------- */
function renderDoctorsGrid() {
    const grid = document.getElementById("adminDoctorsGrid");
    grid.innerHTML = adminDoctors.map(doc => `
        <div class="admin-doc-card">
            <div style="width:60px; height:60px; margin: 0 auto 10px; background:#e0f2fe; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#0284c7; font-size:1.5rem;">
                <i class="fa-solid fa-user-doctor"></i>
            </div>
            <h4>${doc.name}</h4>
            <p>${doc.spec}</p>
            <div class="admin-doc-meta">
                <div>Exp: ${doc.exp}</div>
                <div>Fee: <strong>₹${doc.fee}</strong></div>
                <div style="margin-top:4px; font-size:0.75rem; color:#94a3b8;">${doc.timing}</div>
            </div>
        </div>
    `).join('');
}

/* --------------------------------------------------------------------------
   5. TAB SWITCHING & SEARCH
   -------------------------------------------------------------------------- */
function setupTabSwitching() {
    const btns = document.querySelectorAll(".tab-btn");
    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            btns.forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".admin-tab-content").forEach(c => c.classList.remove("active"));
            
            btn.classList.add("active");
            const targetId = btn.getAttribute("data-tab") + "Tab";
            document.getElementById(targetId).classList.add("active");
        });
    });

    // Print buttons
    document.getElementById("btnExportAppointments")?.addEventListener("click", () => window.print());
    document.getElementById("btnExportLab")?.addEventListener("click", () => window.print());
}

function setupSearchFilter() {
    const searchInput = document.getElementById("adminSearchInput");
    searchInput.addEventListener("input", (e) => {
        const val = e.target.value;
        renderAppointmentsTable(val);
        renderLabTable(val);
    });
}

/* --------------------------------------------------------------------------
   6. ADD DOCTOR MODAL LOGIC
   -------------------------------------------------------------------------- */
function setupModalEvents() {
    const modal = document.getElementById("addDoctorModal");
    const openBtn = document.getElementById("btnOpenAddDoctor");
    const closeBtn = document.getElementById("btnCloseModal");
    const cancelBtn = document.getElementById("btnCancelAdd");
    const form = document.getElementById("addDoctorForm");

    openBtn?.addEventListener("click", () => modal.classList.add("open"));
    closeBtn?.addEventListener("click", () => modal.classList.remove("open"));
    cancelBtn?.addEventListener("click", () => modal.classList.remove("open"));

    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const newDoc = {
            id: adminDoctors.length + 1,
            name: document.getElementById("docName").value,
            spec: document.getElementById("docSpec").value,
            exp: document.getElementById("docExp").value,
            fee: parseInt(document.getElementById("docFee").value),
            timing: document.getElementById("docTiming").value
        };

        adminDoctors.push(newDoc);
        renderDoctorsGrid();
        renderStats();
        modal.classList.remove("open");
        form.reset();
        alert(`Doctor ${newDoc.name} registered successfully!`);
    });
}