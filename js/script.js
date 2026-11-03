/* ==========================================
   MEDICARE+ SMART HOSPITAL COMPANION
   UPDATED JAVASCRIPT
========================================== */


/* ==========================================
   1. CARTOON DOCTORS DATA
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

const doctorContainer = document.getElementById("doctorContainer");

const searchDoctor = document.getElementById("searchDoctor");

const specializationFilter = document.getElementById("specializationFilter");

const appointmentDoctor = document.getElementById("appointmentDoctor");

const appointmentForm = document.getElementById("appointmentForm");

const appointmentDate = document.getElementById("appointmentDate");

const historyContainer = document.getElementById("historyContainer");

const confirmationSection = document.getElementById("confirmationSection");

const reminderBtn = document.getElementById("reminderBtn");

const downloadCard = document.getElementById("downloadCard");


/* ==========================================
   3. LOCAL STORAGE
========================================== */

const STORAGE_KEY = "medicareAppointments";

function getAppointments() {

    try {

        const savedData = localStorage.getItem(STORAGE_KEY);

        const appointments = savedData
            ? JSON.parse(savedData)
            : [];

        return Array.isArray(appointments)
            ? appointments
            : [];

    } catch (error) {

        console.error("Unable to load appointments:", error);

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

        console.error("Unable to save appointments:", error);

        alert("Unable to save booking in this browser.");

        return false;

    }

}


/* ==========================================
   4. SAFE TEXT DISPLAY
========================================== */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = String(text);

    return div.innerHTML;

}


/* ==========================================
   5. DISPLAY DOCTORS
========================================== */

function displayDoctors(doctorList) {

    doctorContainer.innerHTML = "";

    if (doctorList.length === 0) {

        doctorContainer.innerHTML = `
            <p class="empty-history">
                No doctors found.
            </p>
        `;

        return;

    }

    doctorList.forEach((doctor) => {

        const doctorCard = document.createElement("div");

        doctorCard.className = "doctor-card";

        doctorCard.innerHTML = `

            <img
                src="${doctor.image}"
                alt="${escapeHTML(doctor.name)}"
                loading="lazy"
            >

            <div class="doctor-details">

                <h3>${escapeHTML(doctor.name)}</h3>

                <p class="doctor-specialization">
                    ${escapeHTML(doctor.specialization)}
                </p>

                <p class="doctor-experience">
                    ${escapeHTML(doctor.experience)}
                </p>

                <button
                    type="button"
                    data-doctor-id="${doctor.id}"
                >
                    Book Appointment
                </button>

            </div>

        `;

        doctorContainer.appendChild(doctorCard);

    });

}


/* ==========================================
   6. SEARCH AND FILTER DOCTORS
========================================== */

function filterDoctors() {

    const searchText = searchDoctor.value
        .trim()
        .toLowerCase();

    const selectedSpecialization = specializationFilter.value;

    const filteredDoctors = doctors.filter((doctor) => {

        const matchesSearch =

            doctor.name.toLowerCase().includes(searchText) ||

            doctor.specialization.toLowerCase().includes(searchText);


        const matchesSpecialization =

            selectedSpecialization === "all" ||

            doctor.specialization === selectedSpecialization;


        return matchesSearch && matchesSpecialization;

    });

    displayDoctors(filteredDoctors);

}


searchDoctor.addEventListener("input", filterDoctors);

specializationFilter.addEventListener("change", filterDoctors);


/* ==========================================
   7. ADD DOCTORS TO APPOINTMENT FORM
========================================== */

function loadDoctorsInForm() {

    appointmentDoctor.innerHTML = `
        <option value="">
            Choose Doctor
        </option>
    `;

    doctors.forEach((doctor) => {

        const option = document.createElement("option");

        option.value = doctor.id;

        option.textContent =
            `${doctor.name} - ${doctor.specialization}`;

        appointmentDoctor.appendChild(option);

    });

}


/* ==========================================
   8. SELECT DOCTOR FROM CARD
========================================== */

doctorContainer.addEventListener("click", function(event) {

    const button = event.target.closest("[data-doctor-id]");

    if (!button) {
        return;
    }

    const doctorId = button.dataset.doctorId;

    appointmentDoctor.value = doctorId;

    document.getElementById("appointment")
        .scrollIntoView({
            behavior: "smooth"
        });

});


/* ==========================================
   9. DATE FUNCTIONS
========================================== */

function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

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

    return new Date(
        `${appointment.date}T${appointment.time}:00`
    );

}


/* ==========================================
   10. APPOINTMENT BOOKING
========================================== */

appointmentForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const patientName = document.getElementById("patientName")
        .value
        .trim();

    const doctorId = Number(appointmentDoctor.value);

    const date = appointmentDate.value;

    const time = document.getElementById("appointmentTime").value;


    if (!patientName || !doctorId || !date || !time) {

        alert("Please fill all the required fields.");

        return;

    }


    const selectedDoctor = doctors.find((doctor) => {

        return doctor.id === doctorId;

    });


    if (!selectedDoctor) {

        alert("Please select a valid doctor.");

        return;

    }


    const selectedDateTime = new Date(`${date}T${time}:00`);

    if (selectedDateTime <= new Date()) {

        alert("Please select a future appointment date and time.");

        return;

    }


    const appointments = getAppointments();


    const alreadyBooked = appointments.some((appointment) => {

        return (

            appointment.doctorId === doctorId &&

            appointment.date === date &&

            appointment.time === time &&

            appointment.status !== "Cancelled"

        );

    });


    if (alreadyBooked) {

        alert("This doctor already has a demo booking at that time.");

        return;

    }


    const bookingId =
        "MED" + Date.now().toString(36).toUpperCase();


    const newAppointment = {

        bookingId: bookingId,

        patientName: patientName,

        doctorId: selectedDoctor.id,

        doctorName: selectedDoctor.name,

        department: selectedDoctor.specialization,

        date: date,

        time: time,

        status: "Booked"

    };


    appointments.push(newAppointment);

    const saved = saveAppointments(appointments);

    if (!saved) {
        return;
    }


    showAppointmentCard(newAppointment);

    displayAppointmentHistory();

    appointmentForm.reset();

    alert("Demo Appointment Booked Successfully!");

    confirmationSection.scrollIntoView({

        behavior: "smooth"

    });

});


/* ==========================================
   11. DIGITAL APPOINTMENT CARD
========================================== */

function showAppointmentCard(appointment) {

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
   12. PRINT / SAVE APPOINTMENT CARD
========================================== */

downloadCard.addEventListener("click", function() {

    window.print();

});


/* ==========================================
   13. APPOINTMENT HISTORY
========================================== */

function displayAppointmentHistory() {

    const appointments = getAppointments();

    historyContainer.innerHTML = "";


    if (appointments.length === 0) {

        historyContainer.innerHTML = `

            <p class="empty-history">
                No appointments booked yet.
            </p>

        `;

        return;

    }


    appointments.reverse();


    appointments.forEach((appointment) => {

        const card = document.createElement("div");

        card.className = "history-card";


        const appointmentDateTime =
            getAppointmentDateTime(appointment);


        let status = "Upcoming";

        if (appointment.status === "Cancelled") {

            status = "Cancelled";

        } else if (appointmentDateTime < new Date()) {

            status = "Completed / Past";

        }


        card.innerHTML = `

            <div>

                <h3>
                    ${escapeHTML(appointment.doctorName)}
                </h3>

                <p>
                    <strong>Patient:</strong>
                    ${escapeHTML(appointment.patientName)}
                </p>

                <p>
                    <strong>Department:</strong>
                    ${escapeHTML(appointment.department)}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${formatDate(appointment.date)}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${formatTime(appointment.time)}
                </p>

                <p>
                    <strong>Booking ID:</strong>
                    ${escapeHTML(appointment.bookingId)}
                </p>

            </div>


            <div>

                <span class="booking-status">
                    ${status}
                </span>

                ${
                    status === "Upcoming"
                    ? `
                        <br><br>

                        <button
                            class="primary-btn cancel-btn"
                            data-booking-id="${escapeHTML(appointment.bookingId)}"
                        >
                            Cancel
                        </button>
                    `
                    : ""
                }

            </div>

        `;


        historyContainer.appendChild(card);

    });

}


/* ==========================================
   14. CANCEL APPOINTMENT
========================================== */

historyContainer.addEventListener("click", function(event) {

    const button = event.target.closest("[data-booking-id]");

    if (!button) {
        return;
    }

    const bookingId = button.dataset.bookingId;

    const confirmCancel = confirm(
        "Are you sure you want to cancel this demo appointment?"
    );

    if (!confirmCancel) {
        return;
    }


    const appointments = getAppointments();


    const appointment = appointments.find((item) => {

        return item.bookingId === bookingId;

    });


    if (!appointment) {
        return;
    }


    appointment.status = "Cancelled";


    const saved = saveAppointments(appointments);

    if (!saved) {
        return;
    }


    displayAppointmentHistory();

    alert("Demo appointment cancelled successfully.");

});


/* ==========================================
   15. REMINDER DEMO
========================================== */

reminderBtn.addEventListener("click", function() {

    const appointments = getAppointments();

    const currentTime = new Date();


    const upcomingAppointments = appointments.filter((appointment) => {

        return (

            appointment.status !== "Cancelled" &&

            getAppointmentDateTime(appointment) > currentTime

        );

    });


    upcomingAppointments.sort((a, b) => {

        return getAppointmentDateTime(a) - getAppointmentDateTime(b);

    });


    if (upcomingAppointments.length === 0) {

        alert("No upcoming demo appointments found.");

        return;

    }


    const nextAppointment = upcomingAppointments[0];


    alert(

        "⏰ MEDICARE+ APPOINTMENT REMINDER\n\n" +

        "Doctor: " + nextAppointment.doctorName + "\n" +

        "Department: " + nextAppointment.department + "\n" +

        "Date: " + formatDate(nextAppointment.date) + "\n" +

        "Time: " + formatTime(nextAppointment.time) + "\n\n" +

        "This is a demo reminder only."

    );

});


/* ==========================================
   16. INITIALIZE WEBSITE
========================================== */

function initializeWebsite() {

    appointmentDate.min = getTodayDate();

    displayDoctors(doctors);

    loadDoctorsInForm();

    displayAppointmentHistory();

}

initializeWebsite();