/* ==========================================
   MEDICARE+ 2.0
   APPOINTMENT PAGE JAVASCRIPT
========================================== */


/* ==========================================
   1. DOCTORS DATA
========================================== */

const doctors = [

    {
        id: 1,
        name: "Dr. Rahul Sharma",
        specialization: "Cardiology",
        experience: "10 Years Experience",
        image: "https://api.dicebear.com/9.x/notionists/svg?seed=Rahul&backgroundColor=b6e3f4"
    },

    {
        id: 2,
        name: "Dr. Priya Mehta",
        specialization: "Neurology",
        experience: "8 Years Experience",
        image: "https://api.dicebear.com/9.x/notionists/svg?seed=Priya&backgroundColor=ffd5dc"
    },

    {
        id: 3,
        name: "Dr. Amit Verma",
        specialization: "Orthopedics",
        experience: "12 Years Experience",
        image: "https://api.dicebear.com/9.x/notionists/svg?seed=Amit&backgroundColor=c0aede"
    },

    {
        id: 4,
        name: "Dr. Neha Singh",
        specialization: "Dentistry",
        experience: "7 Years Experience",
        image: "https://api.dicebear.com/9.x/notionists/svg?seed=Neha&backgroundColor=ffdfbf"
    },

    {
        id: 5,
        name: "Dr. Arjun Kapoor",
        specialization: "Pediatrics",
        experience: "9 Years Experience",
        image: "https://api.dicebear.com/9.x/notionists/svg?seed=Arjun&backgroundColor=d1f4d1"
    },

    {
        id: 6,
        name: "Dr. Sneha Gupta",
        specialization: "General Medicine",
        experience: "11 Years Experience",
        image: "https://api.dicebear.com/9.x/notionists/svg?seed=Sneha&backgroundColor=ffe4e6"
    }

];


/* ==========================================
   2. SELECT HTML ELEMENTS
========================================== */

const appointmentForm = document.getElementById("appointmentForm");

const appointmentDoctor = document.getElementById("appointmentDoctor");

const appointmentDate = document.getElementById("appointmentDate");

const appointmentTime = document.getElementById("appointmentTime");

const confirmationSection = document.getElementById("confirmationSection");

const historyContainer = document.getElementById("historyContainer");

const reminderBtn = document.getElementById("reminderBtn");

const downloadCard = document.getElementById("downloadCard");


/* ==========================================
   3. LOCAL STORAGE
========================================== */

const STORAGE_KEY = "medicare_appointments_v2";

function getAppointments() {

    try {

        const data = localStorage.getItem(STORAGE_KEY);

        const appointments = data ? JSON.parse(data) : [];

        return Array.isArray(appointments) ? appointments : [];

    } catch (error) {

        return [];

    }

}


function saveAppointments(appointments) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(appointments)
        );

        return true;

    } catch (error) {

        alert("Unable to save booking in this browser.");

        return false;

    }

}


/* ==========================================
   4. SAFE TEXT
========================================== */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = String(text);

    return div.innerHTML;

}


/* ==========================================
   5. DATE HELPERS
========================================== */

function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function formatDate(dateString) {

    const date = new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString("en-IN", {

        day: "numeric",

        month: "long",

        year: "numeric"

    });

}


function formatTime(timeString) {

    const [hours, minutes] = timeString.split(":").map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {

        hour: "2-digit",

        minute: "2-digit",

        hour12: true

    });

}


function getAppointmentDateTime(appointment) {

    return new Date(`${appointment.date}T${appointment.time}:00`);

}


/* ==========================================
   6. POPULATE DOCTOR DROPDOWN
========================================== */

function loadDoctorsInForm() {

    appointmentDoctor.innerHTML = `
        <option value="">Choose Doctor</option>
    `;

    doctors.forEach((doctor) => {

        const option = document.createElement("option");

        option.value = doctor.id;

        option.textContent =
            `${doctor.name} — ${doctor.specialization}`;

        appointmentDoctor.appendChild(option);

    });

}


/* ==========================================
   7. AUTO-SELECT DOCTOR FROM URL
========================================== */

function autoSelectDoctorFromURL() {

    const urlParams = new URLSearchParams(window.location.search);

    const doctorId = urlParams.get("doctor");

    if (doctorId) {

        appointmentDoctor.value = doctorId;

        document.getElementById("booking")
            .scrollIntoView({ behavior: "smooth" });

    }

}


/* ==========================================
   8. BOOKING FORM SUBMIT
========================================== */

appointmentForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const patientName = document.getElementById("patientName")
        .value.trim();

    const doctorId = Number(appointmentDoctor.value);

    const date = appointmentDate.value;

    const time = appointmentTime.value;

    const reason = document.getElementById("appointmentReason")
        .value.trim();


    // Validation

    if (!patientName || !doctorId || !date || !time) {

        alert("Please fill all required fields.");

        return;

    }


    const selectedDoctor = doctors.find((d) => d.id === doctorId);

    if (!selectedDoctor) {

        alert("Please select a valid doctor.");

        return;

    }


    const selectedDateTime = new Date(`${date}T${time}:00`);

    if (selectedDateTime <= new Date()) {

        alert("Please select a future date and time.");

        return;

    }


    const appointments = getAppointments();


    // Check duplicate slot

    const duplicate = appointments.some((apt) => {

        return (

            apt.doctorId === doctorId &&

            apt.date === date &&

            apt.time === time &&

            apt.status !== "Cancelled"

        );

    });


    if (duplicate) {

        alert("This time slot is already booked for this doctor.");

        return;

    }


    // Generate booking ID

    const bookingId =
        "MC-" + Date.now().toString(36).toUpperCase();


    // Create appointment

    const newAppointment = {

        bookingId: bookingId,

        patientName: patientName,

        doctorId: selectedDoctor.id,

        doctorName: selectedDoctor.name,

        department: selectedDoctor.specialization,

        date: date,

        time: time,

        reason: reason || "General Consultation",

        status: "Booked"

    };


    appointments.push(newAppointment);


    if (!saveAppointments(appointments)) {

        return;

    }


    // Show digital card

    showDigitalCard(newAppointment);


    // Update history

    displayHistory();


    // Reset form

    appointmentForm.reset();


    alert("Demo Appointment Booked Successfully!");


    confirmationSection.scrollIntoView({

        behavior: "smooth"

    });

});


/* ==========================================
   9. DIGITAL APPOINTMENT CARD
========================================== */

function showDigitalCard(appointment) {

    document.getElementById("cardBookingId").textContent =
        appointment.bookingId;

    document.getElementById("cardPatient").textContent =
        appointment.patientName;

    document.getElementById("cardDoctor").textContent =
        appointment.doctorName;

    document.getElementById("cardDepartment").textContent =
        appointment.department;

    document.getElementById("cardDate").textContent =
        formatDate(appointment.date);

    document.getElementById("cardTime").textContent =
        formatTime(appointment.time);


    confirmationSection.style.display = "block";

}


/* ==========================================
   10. PRINT / SAVE AS PDF
========================================== */

downloadCard.addEventListener("click", function () {

    window.print();

});


/* ==========================================
   11. APPOINTMENT HISTORY
========================================== */

function displayHistory() {

    const appointments = getAppointments();

    historyContainer.innerHTML = "";


    if (appointments.length === 0) {

        historyContainer.innerHTML = `

            <p class="empty-history">
                📋 No appointments yet.
                Book your first demo appointment above.
            </p>

        `;

        return;

    }


    // Latest first

    const sorted = [...appointments].reverse();


    sorted.forEach((apt) => {

        const card = document.createElement("div");

        card.className = "history-card";


        const aptDateTime = getAppointmentDateTime(apt);

        let status = "Upcoming";

        let statusClass = "status-upcoming";


        if (apt.status === "Cancelled") {

            status = "Cancelled";

            statusClass = "status-cancelled";

        } else if (aptDateTime < new Date()) {

            status = "Completed";

            statusClass = "status-past";

        }


        card.innerHTML = `

            <div>

                <h3>${escapeHTML(apt.doctorName)}</h3>

                <p>
                    <strong>Patient:</strong>
                    ${escapeHTML(apt.patientName)}
                </p>

                <p>
                    <strong>Department:</strong>
                    ${escapeHTML(apt.department)}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${formatDate(apt.date)}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${formatTime(apt.time)}
                </p>

                <p>
                    <strong>Reason:</strong>
                    ${escapeHTML(apt.reason)}
                </p>

                <p>
                    <strong>Booking ID:</strong>
                    ${escapeHTML(apt.bookingId)}
                </p>

            </div>


            <div style="text-align:right;">

                <span class="history-status ${statusClass}">
                    ${status}
                </span>

                ${status === "Upcoming" ? `

                    <br><br>

                    <button
                        class="cancel-btn"
                        data-booking-id="${escapeHTML(apt.bookingId)}"
                    >
                        ❌ Cancel
                    </button>

                ` : ""}

            </div>

        `;


        historyContainer.appendChild(card);

    });

}


/* ==========================================
   12. CANCEL APPOINTMENT
========================================== */

historyContainer.addEventListener("click", function (event) {

    const button = event.target.closest("[data-booking-id]");

    if (!button) return;


    const bookingId = button.dataset.bookingId;


    if (!confirm("Cancel this demo appointment?")) {

        return;

    }


    const appointments = getAppointments();

    const apt = appointments.find((a) => a.bookingId === bookingId);

    if (!apt) return;


    apt.status = "Cancelled";


    if (saveAppointments(appointments)) {

        displayHistory();

        alert("Demo appointment cancelled.");

    }

});


/* ==========================================
   13. REMINDER DEMO
========================================== */

reminderBtn.addEventListener("click", function () {

    const appointments = getAppointments();

    const now = new Date();


    const upcoming = appointments

        .filter((apt) => {

            return (

                apt.status !== "Cancelled" &&

                getAppointmentDateTime(apt) > now

            );

        })

        .sort((a, b) => {

            return getAppointmentDateTime(a) - getAppointmentDateTime(b);

        });


    if (upcoming.length === 0) {

        alert("No upcoming demo appointments found.");

        return;

    }


    const next = upcoming[0];


    alert(

        "⏰ MEDICARE+ REMINDER\n\n" +

        "Doctor: " + next.doctorName + "\n" +

        "Department: " + next.department + "\n" +

        "Date: " + formatDate(next.date) + "\n" +

        "Time: " + formatTime(next.time) + "\n" +

        "Reason: " + next.reason + "\n\n" +

        "This is a demo reminder only."

    );

});


/* ==========================================
   14. INITIALIZE
========================================== */

function init() {

    appointmentDate.min = getTodayDate();

    loadDoctorsInForm();

    autoSelectDoctorFromURL();

    displayHistory();

}


init();