/* ==========================================================================
   Mind Matters Foundation — Global Interactive Script & DOM Controller (Part 3)
   References & Attributions:
   - MDN Web Docs, 2026. Introduction to client-side web APIs and form validation. 
     Available at: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs 
     [Accessed 15 October 2026].
   - Leaflet, 2026. Leaflet JavaScript Library for Interactive Maps Quick Start Guide. 
     Available at: https://leafletjs.com/examples/quick-start/ [Accessed 15 October 2026].
   - Google Gemini, 2026. JavaScript Event Listener and DOM manipulation logic synthesis 
     generated for Jordan Naidoo (WEDE5020). [Accessed 15 October 2026].
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* Helper Function: Display Inline Error with Red Highlight */
    function showError(inputElement, errorElement, message) {
        if (inputElement) inputElement.classList.add('input-error');
        if (errorElement) {
            errorElement.innerText = message;
            errorElement.style.display = 'block';
        }
    }

    /* Helper Function: Clear Inline Error State */
    function clearError(inputElement, errorElement) {
        if (inputElement) inputElement.classList.remove('input-error');
        if (errorElement) {
            errorElement.innerText = '';
            errorElement.style.display = 'none';
        }
    }

    /* ======================================================================
       1. Interactive Leaflet Map Initialization (`contact.html`)
       Reference: Leaflet, 2026. OpenStreetMap integration & Lecturer Guide.
       ====================================================================== */
    if (typeof L === "undefined") {
        console.error("Leaflet could not be loaded. Check your internet connection and script URL.");
    } else {
        // Hub 1: Durban Central Support Hub Map
        const durbanEl = document.getElementById("map-durban");
        if (durbanEl) {
            const durbanLocation = [-29.8579, 31.0113];
            const durbanMap = L.map("map-durban").setView(durbanLocation, 14);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(durbanMap);

            L.marker(durbanLocation).addTo(durbanMap)
                .bindPopup("<strong>Durban Central Support Hub</strong><br>5th Exemouth Ave, Durban Central, 4001<br>Phone: +27 (0)31 555 0192")
                .openPopup();
        }

        // Hub 2: Youth Outreach Centre Map
        const outreachEl = document.getElementById("map-outreach");
        if (outreachEl) {
            const outreachLocation = [-29.7789, 30.9876];
            const outreachMap = L.map("map-outreach").setView(outreachLocation, 14);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(outreachMap);

            L.marker(outreachLocation).addTo(outreachMap)
                .bindPopup("<strong>Youth Outreach Centre</strong><br>Erf 1367 Isilo St, Durban North, 4051<br>Phone: +27 (0)31 555 0198");
        }

        // Hub 3: Main Westville Center Location Map
        const westvilleEl = document.getElementById("map-westville");
        if (westvilleEl) {
            const westvilleLocation = [-29.8311, 30.8852];
            const westvilleMap = L.map("map-westville").setView(westvilleLocation, 14);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(westvilleMap);

            L.marker(westvilleLocation).addTo(westvilleMap)
                .bindPopup("<strong>Main Admin Office</strong><br>Westville, 3629<br>Mind Matters Foundation HQ");
        }
    }

    /* ======================================================================
       2. Lightbox Image Gallery Modal (`services.html`)
       Reference: MDN Web Docs, 2026. Manipulating documents with the DOM.
       ====================================================================== */
    const serviceImages = document.querySelectorAll('.services-grid .card img');
    let lightbox = document.getElementById('lightbox-modal');
    if (!lightbox && serviceImages.length > 0) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox-modal';
        lightbox.style.cssText = `
            display: none; position: fixed; z-index: 1000; left: 0; top: 0;
            width: 100%; height: 100%; background-color: rgba(0,0,0,0.85);
            align-items: center; justify-content: center; flex-direction: column; cursor: pointer;
        `;
        lightbox.innerHTML = `
            <span style="position: absolute; top: 20px; right: 35px; color: #fff; font-size: 40px; font-weight: bold; cursor: pointer;">&times;</span>
            <img id="lightbox-img" style="max-width: 85%; max-height: 80vh; border-radius: 8px; box-shadow: 0 5px 25px rgba(0,0,0,0.5);">
            <p id="lightbox-caption" style="color: #fff; margin-top: 15px; font-size: 1.1rem; font-family: 'Inter', sans-serif;"></p>
        `;
        document.body.appendChild(lightbox);

        const closeBtn = lightbox.querySelector('span');
        closeBtn.addEventListener('click', () => { lightbox.style.display = 'none'; });
        lightbox.addEventListener('click', (e) => {
            if (e.target !== document.getElementById('lightbox-img')) {
                lightbox.style.display = 'none';
            }
        });
    }

    if (serviceImages.length > 0) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        serviceImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                if (lightbox && lightboxImg) {
                    lightbox.style.display = 'flex';
                    lightboxImg.src = img.src;
                    const cardTitle = img.closest('.card').querySelector('h3');
                    lightboxCaption.innerText = cardTitle ? cardTitle.textContent : 'Mind Matters Program View';
                }
            });
        });
    }

    /* ======================================================================
       3. Dynamic Service Search & Real-Time Filtering (`services.html`)
       Reference: W3C, 2026. Document Object Model (DOM) APIs.
       ====================================================================== */
    const servicesMain = document.querySelector('main');
    const servicesGrid = document.querySelector('.services-grid');

    if (servicesGrid && servicesMain) {
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = 'margin-bottom: 25px; text-align: center;';
        searchContainer.innerHTML = `
            <input type="text" id="service-search-input" placeholder="🔍 Search services and programs..." 
            style="max-width: 450px; padding: 12px 18px; border-radius: 25px; border: 1px solid #cbd5e0; font-size: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        `;
        servicesMain.insertBefore(searchContainer, servicesGrid);

        const searchInput = document.getElementById('service-search-input');
        const serviceCards = servicesGrid.querySelectorAll('.card');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            serviceCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const text = card.querySelector('p').textContent.toLowerCase();
                if (title.includes(query) || text.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    /* ======================================================================
       4. Enquiry Form Validation & Dynamic Success Screen (`enquiry.html`)
       Reference: MDN Web Docs, 2026. Client-side form validation handling.
       ====================================================================== */
    const enquiryForm = document.getElementById('enquiryForm');
    const enquirySuccessCard = document.getElementById('enquiry-success-card');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById('fullname');
            const nameErr = document.getElementById('fullname-error');
            const emailInput = document.getElementById('email');
            const emailErr = document.getElementById('email-error');
            const phoneInput = document.getElementById('phone');
            const phoneErr = document.getElementById('phone-error');
            const typeInput = document.getElementById('enquiry-type');
            const typeErr = document.getElementById('enquiry-type-error');
            const msgInput = document.getElementById('message');
            const msgErr = document.getElementById('message-error');

            clearError(nameInput, nameErr);
            clearError(emailInput, emailErr);
            clearError(phoneInput, phoneErr);
            clearError(typeInput, typeErr);
            clearError(msgInput, msgErr);

            if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
                showError(nameInput, nameErr, "Full name is required (minimum 3 characters).");
                isValid = false;
            }

            const emailVal = emailInput.value.trim();
            if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
                showError(emailInput, emailErr, "Please enter a valid email address.");
                isValid = false;
            }

            const phoneVal = phoneInput.value.trim();
            if (!phoneVal) {
                showError(phoneInput, phoneErr, "Phone number is required.");
                isValid = false;
            }

            if (!typeInput.value) {
                showError(typeInput, typeErr, "Please select a reason for enquiry/involvement.");
                isValid = false;
            }

            if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
                showError(msgInput, msgErr, "Please provide a detailed message (minimum 10 characters).");
                isValid = false;
            }

            if (!isValid) return;

            let costText = "Free Community Support";
            let availabilityText = "Immediate placement available";
            if (typeInput.value === 'volunteer') {
                costText = "No Fee (Volunteer Orientation Provided)";
                availabilityText = "Vetting review takes 2-3 business days";
            } else if (typeInput.value === 'sponsor') {
                costText = "Custom Partnership Tier";
                availabilityText = "Consultation scheduled within 24 hours";
            } else if (typeInput.value === 'general') {
                costText = "Complimentary Assistance";
                availabilityText = "Response sent within 48 hours";
            }

            document.getElementById('res-name').innerText = nameInput.value.trim();
            document.getElementById('res-type').innerText = typeInput.options[typeInput.selectedIndex].text;
            document.getElementById('res-cost').innerText = costText;
            document.getElementById('res-avail').innerText = availabilityText;
            document.getElementById('res-email').innerText = emailVal;
            document.getElementById('res-ref').innerText = "MMF-" + Math.floor(100000 + Math.random() * 900000);

            enquiryForm.closest('.card').style.display = 'none';
            enquirySuccessCard.style.display = 'block';
            window.scrollTo({ top: enquirySuccessCard.offsetTop - 50, behavior: 'smooth' });
        });
    }

    /* ======================================================================
       5. Contact Form Validation & Success Screen (`contact.html`)
       Reference: MDN Web Docs, 2026. Form event handling.
       ====================================================================== */
    const contactForm = document.getElementById('contactForm');
    const contactSuccessCard = document.getElementById('contact-success-card');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById('contact-name');
            const nameErr = document.getElementById('contact-name-error');
            const emailInput = document.getElementById('contact-email');
            const emailErr = document.getElementById('contact-email-error');
            const phoneInput = document.getElementById('contact-phone');
            const phoneErr = document.getElementById('contact-phone-error');
            const subjectInput = document.getElementById('contact-subject');
            const subjectErr = document.getElementById('contact-subject-error');
            const msgInput = document.getElementById('contact-message');
            const msgErr = document.getElementById('contact-message-error');

            clearError(nameInput, nameErr);
            clearError(emailInput, emailErr);
            clearError(phoneInput, phoneErr);
            clearError(subjectInput, subjectErr);
            clearError(msgInput, msgErr);

            if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
                showError(nameInput, nameErr, "Full name is required.");
                isValid = false;
            }

            const emailVal = emailInput.value.trim();
            if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
                showError(emailInput, emailErr, "Valid email address is required.");
                isValid = false;
            }

            const phoneVal = phoneInput.value.trim();
            if (!phoneVal) {
                showError(phoneInput, phoneErr, "Phone number is required.");
                isValid = false;
            }

            if (!subjectInput.value) {
                showError(subjectInput, subjectErr, "Please select an inquiry category.");
                isValid = false;
            }

            if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
                showError(msgInput, msgErr, "Message must be at least 10 characters long.");
                isValid = false;
            }

            if (!isValid) return;

            document.getElementById('c-res-name').innerText = nameInput.value.trim();
            document.getElementById('c-res-email').innerText = emailVal;
            document.getElementById('c-res-subject').innerText = subjectInput.options[subjectInput.selectedIndex].text;
            document.getElementById('c-res-ref').innerText = "MMF-CNT-" + Math.floor(100000 + Math.random() * 900000);

            contactForm.closest('.card').style.display = 'none';
            contactSuccessCard.style.display = 'block';
            window.scrollTo({ top: contactSuccessCard.offsetTop - 50, behavior: 'smooth' });
        });
    }

    /* ======================================================================
       6. Crisis Callback Form Validation (`crisis.html`)
       Reference: MDN Web Docs, 2026. Interactive accessibility validation.
       ====================================================================== */
    const crisisForm = document.getElementById('crisisForm');
    const crisisSuccessCard = document.getElementById('crisis-success-card');

    if (crisisForm) {
        crisisForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById('crisis-name');
            const nameErr = document.getElementById('crisis-name-error');
            const phoneInput = document.getElementById('crisis-phone');
            const phoneErr = document.getElementById('crisis-phone-error');
            const urgencyInput = document.getElementById('urgency');
            const urgencyErr = document.getElementById('urgency-error');

            clearError(nameInput, nameErr);
            clearError(phoneInput, phoneErr);
            clearError(urgencyInput, urgencyErr);

            if (!nameInput.value.trim()) {
                showError(nameInput, nameErr, "Name or alias is required.");
                isValid = false;
            }

            const phoneVal = phoneInput.value.trim();
            if (!phoneVal) {
                showError(phoneInput, phoneErr, "Phone number is required for callback.");
                isValid = false;
            }

            if (!urgencyInput.value) {
                showError(urgencyInput, urgencyErr, "Please select an urgency level.");
                isValid = false;
            }

            if (!isValid) return;

            document.getElementById('cr-res-name').innerText = nameInput.value.trim();
            document.getElementById('cr-res-phone').innerText = phoneVal;
            document.getElementById('cr-res-urgency').innerText = urgencyInput.options[urgencyInput.selectedIndex].text;

            crisisForm.closest('.card').style.display = 'none';
            crisisSuccessCard.style.display = 'block';
            window.scrollTo({ top: crisisSuccessCard.offsetTop - 50, behavior: 'smooth' });
        });
    }
});