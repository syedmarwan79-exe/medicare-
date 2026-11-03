/* ==========================================
   MEDICARE+ 2.0
   LAB TESTS PAGE JAVASCRIPT
========================================== */


/* ==========================================
   1. LAB TESTS DATA
========================================== */

const labTests = [

    {
        id: 1,
        name: "Complete Blood Count",
        shortName: "CBC",
        category: "Blood",
        icon: "🩸",
        price: 350,
        duration: "2-4 Hours",
        description: "Full blood cell analysis"
    },

    {
        id: 2,
        name: "Blood Sugar Test",
        shortName: "BS",
        category: "Blood",
        icon: "💉",
        price: 200,
        duration: "1-2 Hours",
        description: "Fasting & post-meal glucose"
    },

    {
        id: 3,
        name: "Thyroid Profile",
        shortName: "TFT",
        category: "Blood",
        icon: "🧬",
        price: 600,
        duration: "4-6 Hours",
        description: "T3, T4 and TSH levels"
    },

    {
        id: 4,
        name: "Chest X-Ray",
        shortName: "CXR",
        category: "Imaging",
        icon: "🫁",
        price: 500,
        duration: "30 Minutes",
        description: "Chest and lung imaging"
    },

    {
        id: 5,
        name: "MRI Scan",
        shortName: "MRI",
        category: "Imaging",
        icon: "🧲",
        price: 5000,
        duration: "45-60 Minutes",
        description: "Detailed body imaging"
    },

    {
        id: 6,
        name: "CT Scan",
        shortName: "CT",
        category: "Imaging",
        icon: "🔬",
        price: 3500,
        duration: "30-45 Minutes",
        description: "Cross-sectional body scan"
    },

    {
        id: 7,
        name: "Liver Function Test",
        shortName: "LFT",
        category: "Organ",
        icon: "🫀",
        price: 450,
        duration: "3-5 Hours",
        description: "Liver health analysis"
    },

    {
        id: 8,
        name: "Kidney Function Test",
        shortName: "KFT",
        category: "Organ",
        icon: "🧪",
        price: 500,
        duration: "3-5 Hours",
        description: "Kidney health analysis"
    }

];


/* ==========================================
   2. SELECT HTML ELEMENTS
========================================== */

const labTestsGrid = document.getElementById("labTestsGrid");

const searchTest = document.getElementById("searchTest");

const testCategoryFilter = document.getElementById("testCategoryFilter");

const labBookingForm = document.getElementById("labBookingForm");

const labTestSelect = document.getElementById("labTestSelect");

const labDate = document.getElementById("labDate");

const labReceiptSection = document.getElementById("labReceiptSection");

const labHistoryContainer = document.getElementById("labHistoryContainer");

const printLabReceipt = document.getElementById("printLabReceipt");


/* ==========================================
   3. LOCAL STORAGE
========================================== */

const LAB_STORAGE_KEY = "medicare_lab_bookings_v2";

function getLabBookings() {

    try {

        const data = localStorage.getItem(LAB_STORAGE_KEY);

        const bookings = data ? JSON.parse(data) : [];

        return Array.isArray(bookings) ? bookings : [];

    } catch (error) {

        return [];

    }

}


function saveLabBookings(bookings) {

    try {

        localStorage.setItem(
            LAB_STORAGE_KEY,
            JSON.stringify(bookings)
        );

        return true;

    } catch (error) {

        alert("Unable to save lab booking.");

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


/* ==========================================
   6. DISPLAY LAB TEST CARDS
========================================== */

function displayTests(testList) {

    labTestsGrid.innerHTML = "";

    if (testList.length === 0) {

        labTestsGrid.innerHTML = `

            <p class="no-tests">
                😕 No lab tests found. Try another search.
            </p>

        `;

        return;

    }


    testList.forEach((test) => {

        const card = document.createElement("div");

        card.className = "lab-test-card";


        card.innerHTML = `

            <div class="lab-test-icon">
                ${test.icon}
            </div>

            <h3>${escapeHTML(test.name)}</h3>

            <p class="lab-test-category">
                ${escapeHTML(test.category)}
                · ${escapeHTML(test.duration)}
            </p>

            <p class="lab-test-price">
                ₹${test.price}
                <span>(Sample Price)</span>
            </p>

            <button
                type="button"
                data-test-id="${test.id}"
            >
                📅 Book This Test
            </button>

        `;


        labTestsGrid.appendChild(card);

    });

}


/* ==========================================
   7. SEARCH + CATEGORY FILTER
========================================== */

function filterTests() {

    const searchText = searchTest.value
        .toLowerCase()
        .trim();


    const selectedCategory = testCategoryFilter.value;


    const filtered = labTests.filter((test) => {

        const matchesSearch =

            test.name.toLowerCase().includes(searchText) ||

            test.shortName.toLowerCase().includes(searchText) ||

            test.description.toLowerCase().includes(searchText);


        const matchesCategory =

            selectedCategory === "all" ||

            test.category === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    displayTests(filtered);

}


searchTest.addEventListener("input", filterTests);

testCategoryFilter.addEventListener("change", filterTests);


/* ==========================================
   8. POPULATE TEST DROPDOWN
========================================== */

function loadTestsInForm() {

    labTestSelect.innerHTML = `
        <option value="">Choose Test</option>
    `;

    labTests.forEach((test) => {

        const option = document.createElement("option");

        option.value = test.id;

        option.textContent =
            `${test.name} — ₹${test.price}`;

        labTestSelect.appendChild(option);

    });

}


/* ==========================================
   9. SELECT TEST FROM CARD
========================================== */

labTestsGrid.addEventListener("click", function (event) {

    const button = event.target.closest("[data-test-id]");

    if (!button) return;


    const testId = button.dataset.testId;

    labTestSelect.value = testId;


    document.getElementById("lab-booking")
        .scrollIntoView({ behavior: "smooth" });

});


/* ==========================================
   10. LAB BOOKING FORM SUBMIT
========================================== */

labBookingForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const patientName = document.getElementById("labPatientName")
        .value.trim();

    const testId = Number(labTestSelect.value);

    const date = labDate.value;

    const time = document.getElementById("labTime").value;


    if (!patientName || !testId || !date || !time) {

        alert("Please fill all required fields.");

        return;

    }


    const selectedTest = labTests.find((t) => t.id === testId);

    if (!selectedTest) {

        alert("Please select a valid lab test.");

        return;

    }


    const selectedDateTime = new Date(`${date}T${time}:00`);

    if (selectedDateTime <= new Date()) {

        alert("Please select a future date and time.");

        return;

    }


    const bookings = getLabBookings();


    const receiptId =
        "LAB-" + Date.now().toString(36).toUpperCase();


    const newBooking = {

        receiptId: receiptId,

        patientName: patientName,

        testId: selectedTest.id,

        testName: selectedTest.name,

        category: selectedTest.category,

        icon: selectedTest.icon,

        price: selectedTest.price,

        date: date,

        time: time,

        status: "Booked"

    };


    bookings.push(newBooking);


    if (!saveLabBookings(bookings)) {

        return;

    }


    showLabReceipt(newBooking);

    displayLabHistory();

    labBookingForm.reset();


    alert("Demo Lab Test Booked Successfully!");


    labReceiptSection.scrollIntoView({

        behavior: "smooth"

    });

});


/* ==========================================
   11. LAB RECEIPT
========================================== */

function showLabReceipt(booking) {

    document.getElementById("receiptId").textContent =
        booking.receiptId;

    document.getElementById("receiptPatient").textContent =
        booking.patientName;

    document.getElementById("receiptTest").textContent =
        booking.testName;

    document.getElementById("receiptCategory").textContent =
        booking.category;

    document.getElementById("receiptDate").textContent =
        formatDate(booking.date);

    document.getElementById("receiptTime").textContent =
        formatTime(booking.time);

    document.getElementById("receiptPrice").textContent =
        `₹${booking.price} (Sample)`;


    labReceiptSection.style.display = "block";

}


printLabReceipt.addEventListener("click", function () {

    window.print();

});


/* ==========================================
   12. LAB BOOKING HISTORY
========================================== */

function displayLabHistory() {

    const bookings = getLabBookings();

    labHistoryContainer.innerHTML = "";


    if (bookings.length === 0) {

        labHistoryContainer.innerHTML = `

            <p class="empty-lab-history">
                🧪 No lab test bookings yet.
                Book your first demo test above.
            </p>

        `;

        return;

    }


    const sorted = [...bookings].reverse();


    sorted.forEach((booking) => {

        const card = document.createElement("div");

        card.className = "lab-history-card";


        let status = "Upcoming";

        let statusClass = "status-upcoming";


        const bookingDateTime = new Date(
            `${booking.date}T${booking.time}:00`
        );


        if (booking.status === "Cancelled") {

            status = "Cancelled";

            statusClass = "status-cancelled";

        } else if (bookingDateTime < new Date()) {

            status = "Completed";

            statusClass = "status-past";

        }


        card.innerHTML = `

            <div>

                <h3>
                    ${booking.icon}
                    ${escapeHTML(booking.testName)}
                </h3>

                <p>
                    <strong>Patient:</strong>
                    ${escapeHTML(booking.patientName)}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${escapeHTML(booking.category)}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${formatDate(booking.date)}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${formatTime(booking.time)}
                </p>

                <p>
                    <strong>Price:</strong>
                    ₹${booking.price} (Sample)
                </p>

                <p>
                    <strong>Receipt ID:</strong>
                    ${escapeHTML(booking.receiptId)}
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
                        data-lab-id="${escapeHTML(booking.receiptId)}"
                    >
                        ❌ Cancel
                    </button>

                ` : ""}

            </div>

        `;


        labHistoryContainer.appendChild(card);

    });

}


/* ==========================================
   13. CANCEL LAB BOOKING
========================================== */

labHistoryContainer.addEventListener("click", function (event) {

    const button = event.target.closest("[data-lab-id]");

    if (!button) return;


    const receiptId = button.dataset.labId;


    if (!confirm("Cancel this demo lab booking?")) {

        return;

    }


    const bookings = getLabBookings();

    const booking = bookings.find(
        (b) => b.receiptId === receiptId
    );

    if (!booking) return;


    booking.status = "Cancelled";


    if (saveLabBookings(bookings)) {

        displayLabHistory();

        alert("Demo lab booking cancelled.");

    }

});


/* ==========================================
   14. INITIALIZE
========================================== */

function init() {

    labDate.min = getTodayDate();

    displayTests(labTests);

    loadTestsInForm();

    displayLabHistory();

}


init();