/* ==========================================
   MEDICARE+ 2.0
   PATIENT DASHBOARD JAVASCRIPT
========================================== */


/* ==========================================
   1. LOCAL STORAGE KEYS
========================================== */

const APPOINTMENT_KEY = "medicare_appointments_v2";

const LAB_KEY = "medicare_lab_bookings_v2";


/* ==========================================
   2. HELPER FUNCTIONS
========================================== */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = String(text);

    return div.innerHTML;

}


function getData(key) {

    try {

        const data = localStorage.getItem(key);

        const parsed = data ? JSON.parse(data) : [];

        return Array.isArray(parsed) ? parsed : [];

    } catch (error) {

        return [];

    }

}


function formatDate(dateString) {

    const date = new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString("en-IN", {

        day: "numeric",

        month: "short",

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


/* ==========================================
   3. LOAD DATA
========================================== */

const appointments = getData(APPOINTMENT_KEY);

const labBookings = getData(LAB_KEY);

const now = new Date();


/* ==========================================
   4. CALCULATE STATISTICS
========================================== */

const totalAppointments = appointments.length;


const upcomingAppointments = appointments.filter((apt) => {

    const aptDate = new Date(`${apt.date}T${apt.time}:00`);

    return apt.status !== "Cancelled" && aptDate > now;

});


const completedAppointments = appointments.filter((apt) => {

    const aptDate = new Date(`${apt.date}T${apt.time}:00`);

    return apt.status !== "Cancelled" && aptDate <= now;

});


const cancelledAppointments = appointments.filter((apt) => {

    return apt.status === "Cancelled";

});


const totalLabBookings = labBookings.length;


/* ==========================================
   5. DISPLAY STATISTICS
========================================== */

function displayStats() {

    document.getElementById("statTotal").textContent =
        totalAppointments;

    document.getElementById("statUpcoming").textContent =
        upcomingAppointments.length;

    document.getElementById("statCompleted").textContent =
        completedAppointments.length;

    document.getElementById("statCancelled").textContent =
        cancelledAppointments.length;

    document.getElementById("statLab").textContent =
        totalLabBookings;

}


/* ==========================================
   6. ANIMATE PROGRESS BARS
========================================== */

function displayProgress() {

    // Completion percentage

    let completionPercent = 0;

    if (totalAppointments > 0) {

        completionPercent = Math.round(

            (completedAppointments.length / totalAppointments) * 100

        );

    }


    // Cancellation percentage

    let cancelPercent = 0;

    if (totalAppointments > 0) {

        cancelPercent = Math.round(

            (cancelledAppointments.length / totalAppointments) * 100

        );

    }


    // Lab activity percentage (out of 10 max)

    let labPercent = Math.min(totalLabBookings * 10, 100);


    // Update text

    document.getElementById("completionPercent").textContent =
        completionPercent + "%";

    document.getElementById("cancelPercent").textContent =
        cancelPercent + "%";

    document.getElementById("labPercent").textContent =
        labPercent + "%";


    // Animate bars after small delay

    setTimeout(() => {

        document.getElementById("completionBar").style.width =
            completionPercent + "%";

        document.getElementById("cancelBar").style.width =
            cancelPercent + "%";

        document.getElementById("labBar").style.width =
            labPercent + "%";

    }, 500);

}


/* ==========================================
   7. DISPLAY UPCOMING APPOINTMENTS
========================================== */

function displayUpcoming() {

    const container = document.getElementById("upcomingContainer");

    container.innerHTML = "";


    if (upcomingAppointments.length === 0) {

        container.innerHTML = `

            <p class="empty-upcoming">
                📅 No upcoming appointments.
                <br>
                <a href="appointment.html" style="color:#1677ff;">
                    Book one now →
                </a>
            </p>

        `;

        return;

    }


    // Sort by date (nearest first)

    const sorted = [...upcomingAppointments].sort((a, b) => {

        const dateA = new Date(`${a.date}T${a.time}:00`);

        const dateB = new Date(`${b.date}T${b.time}:00`);

        return dateA - dateB;

    });


    // Show maximum 5

    const displayList = sorted.slice(0, 5);


    displayList.forEach((apt) => {

        const card = document.createElement("div");

        card.className = "upcoming-card";


        card.innerHTML = `

            <div>

                <h3>
                    👨‍⚕️ ${escapeHTML(apt.doctorName)}
                </h3>

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
                    ${escapeHTML(apt.reason || "General")}
                </p>

            </div>


            <span class="upcoming-badge">
                📅 Upcoming
            </span>

        `;


        container.appendChild(card);

    });

}


/* ==========================================
   8. DISPLAY RECENT LAB TESTS
========================================== */

function displayRecentLab() {

    const container = document.getElementById("recentLabContainer");

    container.innerHTML = "";


    const activeBookings = labBookings.filter((b) => {

        return b.status !== "Cancelled";

    });


    if (activeBookings.length === 0) {

        container.innerHTML = `

            <p class="empty-recent-lab">
                🧪 No lab test bookings yet.
                <br>
                <a href="lab-tests.html" style="color:#1677ff;">
                    Book a test now →
                </a>
            </p>

        `;

        return;

    }


    // Latest first, max 5

    const sorted = [...activeBookings].reverse().slice(0, 5);


    sorted.forEach((booking) => {

        const card = document.createElement("div");

        card.className = "recent-lab-card";


        const bookingDate = new Date(
            `${booking.date}T${booking.time}:00`
        );

        let status = "Upcoming";

        if (bookingDate <= now) {

            status = "Completed";

        }


        card.innerHTML = `

            <div>

                <h3>
                    ${booking.icon}
                    ${escapeHTML(booking.testName)}
                </h3>

                <p>
                    <strong>Date:</strong>
                    ${formatDate(booking.date)}
                    · ${formatTime(booking.time)}
                </p>

                <p>
                    <strong>Price:</strong>
                    ₹${booking.price} (Sample)
                </p>

            </div>


            <span class="upcoming-badge">
                ${status}
            </span>

        `;


        container.appendChild(card);

    });

}


/* ==========================================
   9. INITIALIZE DASHBOARD
========================================== */

function initDashboard() {

    displayStats();

    displayProgress();

    displayUpcoming();

    displayRecentLab();

}


initDashboard();