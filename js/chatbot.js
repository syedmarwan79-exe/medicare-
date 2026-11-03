/* ==========================================
   MEDICARE+ 2.0
   SMART HOSPITAL CHATBOT JAVASCRIPT
========================================== */


/* ==========================================
   1. SELECT HTML ELEMENTS
========================================== */

const chatMessages = document.getElementById("chatMessages");

const chatForm = document.getElementById("chatForm");

const chatInput = document.getElementById("chatInput");

const chatSuggestions = document.getElementById("chatSuggestions");


/* ==========================================
   2. SAFE TEXT
========================================== */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = String(text);

    return div.innerHTML;

}


/* ==========================================
   3. CHATBOT RESPONSES DATABASE
========================================== */

const responses = [

    {
        keywords: ["appointment", "book", "booking", "schedule", "visit"],
        reply: `📅 <strong>Appointment Booking</strong>

<p>To book a demo appointment:</p>

<ul>
    <li>Go to the <a href="appointment.html">Appointments Page</a></li>
    <li>Select a doctor from the dropdown</li>
    <li>Choose a future date and time slot</li>
    <li>Enter a sample patient name</li>
    <li>Click "Confirm Appointment"</li>
</ul>

<p>You will receive a digital appointment card after booking!</p>

<p>💡 <em>Tip: You can also click "Book Appointment" on any doctor card on the <a href="doctors.html">Doctors Page</a>.</em></p>`
    },

    {
        keywords: ["doctor", "doctors", "specialist", "find doctor", "search doctor"],
        reply: `👨‍⚕️ <strong>Our Sample Doctors</strong>

<p>MediCare+ has 6 specialist doctors:</p>

<ul>
    <li>❤️ <strong>Dr. Rahul Sharma</strong> — Cardiology (10 yrs)</li>
    <li>🧠 <strong>Dr. Priya Mehta</strong> — Neurology (8 yrs)</li>
    <li>🦴 <strong>Dr. Amit Verma</strong> — Orthopedics (12 yrs)</li>
    <li>🦷 <strong>Dr. Neha Singh</strong> — Dentistry (7 yrs)</li>
    <li>👶 <strong>Dr. Arjun Kapoor</strong> — Pediatrics (9 yrs)</li>
    <li>🩺 <strong>Dr. Sneha Gupta</strong> — General Medicine (11 yrs)</li>
</ul>

<p>Visit the <a href="doctors.html">Doctors Page</a> to search and filter doctors by specialization.</p>`
    },

    {
        keywords: ["lab", "test", "tests", "blood", "x-ray", "mri", "ct scan", "diagnostic"],
        reply: `🧪 <strong>Lab Test Booking</strong>

<p>We offer 8 sample diagnostic tests:</p>

<ul>
    <li>🩸 Complete Blood Count (CBC) — ₹350</li>
    <li>💉 Blood Sugar Test — ₹200</li>
    <li>🧬 Thyroid Profile — ₹600</li>
    <li>🫁 Chest X-Ray — ₹500</li>
    <li>🧲 MRI Scan — ₹5000</li>
    <li>🔬 CT Scan — ₹3500</li>
    <li>🫀 Liver Function Test — ₹450</li>
    <li>🧪 Kidney Function Test — ₹500</li>
</ul>

<p>Visit the <a href="lab-tests.html">Lab Tests Page</a> to book a demo test.</p>

<p>⚠️ <em>Prices are for demo purposes only.</em></p>`
    },

    {
        keywords: ["dashboard", "stats", "statistics", "overview", "my bookings"],
        reply: `📊 <strong>Patient Dashboard</strong>

<p>The dashboard shows your healthcare overview:</p>

<ul>
    <li>📋 Total appointments count</li>
    <li>📅 Upcoming appointments</li>
    <li>✅ Completed appointments</li>
    <li>❌ Cancelled appointments</li>
    <li>🧪 Lab test bookings</li>
    <li>📈 Activity progress bars</li>
</ul>

<p>Visit the <a href="dashboard.html">Dashboard Page</a> to see your stats.</p>

<p>💡 <em>Stats update automatically when you book or cancel appointments.</em></p>`
    },

    {
        keywords: ["department", "departments", "specialization", "cardiology", "neurology", "orthopedics", "dentistry", "pediatrics"],
        reply: `🏥 <strong>Hospital Departments</strong>

<p>MediCare+ covers 6 medical departments:</p>

<ul>
    <li>❤️ <strong>Cardiology</strong> — Heart and cardiovascular care</li>
    <li>🧠 <strong>Neurology</strong> — Brain and nervous system</li>
    <li>🦴 <strong>Orthopedics</strong> — Bone, joint and muscle</li>
    <li>🦷 <strong>Dentistry</strong> — Dental and oral health</li>
    <li>👶 <strong>Pediatrics</strong> — Children's healthcare</li>
    <li>🩺 <strong>General Medicine</strong> — General consultations</li>
</ul>

<p>You can filter doctors by department on the <a href="doctors.html">Doctors Page</a>.</p>`
    },

    {
        keywords: ["emergency", "ambulance", "urgent", "help", "accident"],
        reply: `🚑 <strong>Emergency Information</strong>

<p>⚠️ <strong>This is a demo website.</strong> It does not provide real emergency services.</p>

<p>In a real emergency, please call:</p>

<ul>
    <li>📞 <strong>112</strong> — National Emergency Number</li>
    <li>📞 <strong>108</strong> — Ambulance Services</li>
    <li>📞 <strong>102</strong> — Health Helpline</li>
</ul>

<p>🏥 Visit your nearest hospital immediately in case of a medical emergency.</p>

<p>⚠️ <em>Do not rely on this demo website for real medical emergencies.</em></p>`
    },

    {
        keywords: ["cancel", "cancellation", "cancel appointment"],
        reply: `❌ <strong>Cancel an Appointment</strong>

<p>To cancel a demo appointment:</p>

<ul>
    <li>Go to the <a href="appointment.html">Appointments Page</a></li>
    <li>Scroll down to "Appointment History"</li>
    <li>Find your upcoming appointment</li>
    <li>Click the "Cancel" button</li>
    <li>Confirm the cancellation</li>
</ul>

<p>Cancelled appointments will still appear in your history with a "Cancelled" status.</p>`
    },

    {
        keywords: ["card", "digital card", "receipt", "print", "pdf", "download"],
        reply: `💳 <strong>Digital Appointment Card</strong>

<p>After booking an appointment, you receive a digital card with:</p>

<ul>
    <li>🔖 Unique Booking ID</li>
    <li>👤 Patient Name</li>
    <li>👨‍⚕️ Doctor Name & Department</li>
    <li>📅 Date & Time</li>
</ul>

<p>To save the card:</p>

<ul>
    <li>Click "Print / Save as PDF" button</li>
    <li>Select "Save as PDF" in the print dialog</li>
</ul>

<p>⚠️ <em>The digital card is for demo purposes only.</em></p>`
    },

    {
        keywords: ["reminder", "notification", "alert", "upcoming"],
        reply: `⏰ <strong>Appointment Reminders</strong>

<p>MediCare+ has a demo reminder feature:</p>

<ul>
    <li>Go to the <a href="appointment.html">Appointments Page</a></li>
    <li>Scroll to the "Reminder" section</li>
    <li>Click "Check Reminder"</li>
    <li>You will see details of your next upcoming appointment</li>
</ul>

<p>⚠️ <em>This is a demo reminder. Real SMS or push notifications require a backend server.</em></p>`
    },

    {
        keywords: ["how", "how to", "how does", "how it works", "guide", "tutorial"],
        reply: `📖 <strong>How MediCare+ Works</strong>

<p>MediCare+ is simple to use:</p>

<ul>
    <li><strong>Step 1:</strong> Browse doctors on the <a href="doctors.html">Doctors Page</a></li>
    <li><strong>Step 2:</strong> Book an appointment on the <a href="appointment.html">Appointments Page</a></li>
    <li><strong>Step 3:</strong> Get your digital appointment card</li>
    <li><strong>Step 4:</strong> View your bookings on the <a href="dashboard.html">Dashboard</a></li>
    <li><strong>Step 5:</strong> Book lab tests on the <a href="lab-tests.html">Lab Tests Page</a></li>
</ul>

<p>All data is saved in your browser's localStorage.</p>`
    },

    {
        keywords: ["hello", "hi", "hey", "good morning", "good evening", "namaste"],
        reply: `👋 <strong>Hello! Welcome to MediCare+!</strong>

<p>I am your Smart Hospital Assistant. I can help you with:</p>

<ul>
    <li>📅 Appointment booking</li>
    <li>👨‍⚕️ Doctor information</li>
    <li>🧪 Lab test details</li>
    <li>📊 Dashboard features</li>
    <li>🏥 Hospital departments</li>
    <li>🚑 Emergency information</li>
</ul>

<p>Ask me anything! 😊</p>`
    },

    {
        keywords: ["thank", "thanks", "thank you", "dhanyavad"],
        reply: `😊 <strong>You're welcome!</strong>

<p>I'm glad I could help. If you have any more questions about MediCare+, feel free to ask!</p>

<p>Quick links:</p>

<ul>
    <li><a href="index.html">🏠 Home</a></li>
    <li><a href="appointment.html">📅 Book Appointment</a></li>
    <li><a href="dashboard.html">📊 Dashboard</a></li>
</ul>`
    },

    {
        keywords: ["project", "student", "college", "training", "developer", "who made", "about"],
        reply: `🎓 <strong>About This Project</strong>

<p>MediCare+ is an educational project built by Diploma CSE students as part of their Industrial Training.</p>

<ul>
    <li>💻 <strong>Technologies:</strong> HTML, CSS, JavaScript</li>
    <li>👥 <strong>Team:</strong> 5 Students</li>
    <li>🏥 <strong>Purpose:</strong> Hospital management demo</li>
    <li>💾 <strong>Data Storage:</strong> Browser LocalStorage</li>
</ul>

<p>⚠️ <em>This is a frontend prototype, not a real hospital system.</em></p>`
    }

];


/* ==========================================
   4. DEFAULT RESPONSE
========================================== */

const defaultReply = `🤔 <strong>I'm not sure about that.</strong>

<p>I am a demo chatbot and can only answer questions about MediCare+ features.</p>

<p>Try asking about:</p>

<ul>
    <li>📅 "How to book an appointment?"</li>
    <li>👨‍⚕️ "Show me the doctors"</li>
    <li>🧪 "What lab tests are available?"</li>
    <li>📊 "Tell me about the dashboard"</li>
    <li>🏥 "What departments do you have?"</li>
</ul>`;


/* ==========================================
   5. FIND RESPONSE
========================================== */

function findResponse(userMessage) {

    const lowerMessage = userMessage.toLowerCase();


    for (let i = 0; i < responses.length; i++) {

        const keywords = responses[i].keywords;


        for (let j = 0; j < keywords.length; j++) {

            if (lowerMessage.includes(keywords[j])) {

                return responses[i].reply;

            }

        }

    }


    return defaultReply;

}


/* ==========================================
   6. ADD MESSAGE TO CHAT
========================================== */

function addMessage(text, isBot) {

    const messageDiv = document.createElement("div");

    messageDiv.className = isBot
        ? "message bot-message"
        : "message user-message";


    const avatar = isBot ? "🤖" : "👤";


    messageDiv.innerHTML = `

        <div class="message-avatar">${avatar}</div>

        <div class="message-bubble">
            ${isBot ? text : `<p>${escapeHTML(text)}</p>`}
        </div>

    `;


    chatMessages.appendChild(messageDiv);


    // Auto scroll to bottom

    chatMessages.scrollTop = chatMessages.scrollHeight;

}


/* ==========================================
   7. TYPING INDICATOR
========================================== */

function showTyping() {

    const typingDiv = document.createElement("div");

    typingDiv.className = "message bot-message";

    typingDiv.id = "typingIndicator";


    typingDiv.innerHTML = `

        <div class="message-avatar">🤖</div>

        <div class="message-bubble">

            <div class="typing-indicator">

                <div class="typing-dot"></div>

                <div class="typing-dot"></div>

                <div class="typing-dot"></div>

            </div>

        </div>

    `;


    chatMessages.appendChild(typingDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;

}


function removeTyping() {

    const typing = document.getElementById("typingIndicator");

    if (typing) {

        typing.remove();

    }

}


/* ==========================================
   8. HANDLE USER MESSAGE
========================================== */

function handleUserMessage(message) {

    const trimmed = message.trim();

    if (!trimmed) return;


    // Add user message

    addMessage(trimmed, false);


    // Clear input

    chatInput.value = "";


    // Show typing indicator

    showTyping();


    // Simulate bot thinking delay

    const delay = 800 + Math.random() * 1200;


    setTimeout(() => {

        removeTyping();


        const reply = findResponse(trimmed);

        addMessage(reply, true);

    }, delay);

}


/* ==========================================
   9. FORM SUBMIT
========================================== */

chatForm.addEventListener("submit", function (event) {

    event.preventDefault();

    handleUserMessage(chatInput.value);

});


/* ==========================================
   10. SUGGESTION BUTTONS
========================================== */

chatSuggestions.addEventListener("click", function (event) {

    const button = event.target.closest("[data-query]");

    if (!button) return;


    const query = button.dataset.query;

    handleUserMessage(query);

});


/* ==========================================
   11. FOCUS INPUT ON LOAD
========================================== */

chatInput.focus();