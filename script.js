document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('betaSignupForm');
    
    // --- UTM Parameter Handling ---
    function getUtmParams() {
        const params = new URLSearchParams(window.location.search);
        document.getElementById('utm_source').value = params.get('utm_source') || '';
        document.getElementById('utm_medium').value = params.get('utm_medium') || '';
        document.getElementById('utm_campaign').value = params.get('utm_campaign') || '';
        document.getElementById('utm_content').value = params.get('utm_content') || '';
    }
    getUtmParams(); // Populate UTM fields on page load

    // --- Custom Form Validation & Submission ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stop the browser's default form submission

        let isValid = true; // Flag to track overall form validity

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.form-group input, .form-group select, .radio-group, .radio-group-horizontal').forEach(el => {
            el.classList.remove('invalid-field'); // Clear invalid styling
        });

        // 1. Validate User Role (Radio Group) - ONLY if field exists (skipped in Variant C)
        const userRoleGroup = document.getElementById('userRole');
        if (userRoleGroup) {
            const userRoleRadios = form.elements.userRole; // Access by name
            let isUserRoleSelected = false;
            for (const radio of userRoleRadios) {
                if (radio.checked) {
                    isUserRoleSelected = true;
                    break;
                }
            }
            if (!isUserRoleSelected) {
                isValid = false;
                const errorElement = document.getElementById('userRoleError');
                if (errorElement) {
                    errorElement.textContent = 'Please select your role.';
                    errorElement.style.display = 'block';
                }
                userRoleGroup.classList.add('invalid-field'); // Add class to the group container
            }
        }

        // 2. Validate Email
        const emailInput = form.elements.email;
        if (!emailInput.checkValidity()) { // Uses HTML5 built-in validation for email format
            isValid = false;
            const errorElement = document.getElementById('emailError');
            errorElement.textContent = emailInput.validationMessage || 'Please enter a valid email address.';
            errorElement.style.display = 'block';
            emailInput.classList.add('invalid-field');
        }

        // 3. Validate NAICS Interest
        const naicsInput = form.elements.naicsInterest;
        if (!naicsInput.checkValidity()) {
            isValid = false;
            const errorElement = document.getElementById('naicsInterestError');
            errorElement.textContent = naicsInput.validationMessage || 'Please enter your target industries.';
            errorElement.style.display = 'block';
            naicsInput.classList.add('invalid-field');
        }

        // 4. Validate Pricing Tier Selection (Radio Group)
        const pricingTierGroup = document.querySelector('.pricing-tier-selection');
        if (pricingTierGroup) {
            const pricingTierRadios = form.elements.pricingTier; // Access by name
            let isPricingTierSelected = false;
            for (const radio of pricingTierRadios) {
                if (radio.checked) {
                    isPricingTierSelected = true;
                    break;
                }
            }
            if (!isPricingTierSelected) {
                isValid = false;
                const errorElement = document.getElementById('pricingTierError');
                if (errorElement) {
                    errorElement.textContent = 'Please select a plan.';
                    errorElement.style.display = 'block';
                }
                pricingTierGroup.classList.add('invalid-field'); // Add class to the group container
            }
        }

        // 5. Validate Referral Source (Select Dropdown) - ONLY if field exists and not hidden (skipped in Variant C)
        const sourceChannelSelect = form.elements.sourceChannel;
        if (sourceChannelSelect && sourceChannelSelect.type !== 'hidden') {
            if (!sourceChannelSelect.checkValidity()) {
                isValid = false;
                const errorElement = document.getElementById('sourceChannelError');
                if (errorElement) {
                    errorElement.textContent = sourceChannelSelect.validationMessage || 'Please tell us how you heard about us.';
                    errorElement.style.display = 'block';
                }
                sourceChannelSelect.classList.add('invalid-field');
            }
        }

        // --- If all validation passes, proceed with submission ---
        if (isValid) {
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => (data[key] = value));

            console.log('Form data ready to send:', data); // For debugging

            // --- IMPORTANT: Replace with your actual Google Apps Script Web App URL ---
            const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyoMqali2f1SblGMSKTtC2pytoRAets_Fw-uaI0nhGTL-oxGkaw8xrHM_jNcxvcCul_PQ/exec'; 

            try {
                // Using 'no-cors' is typically required for Google Apps Script Web Apps
                const response = await fetch(GOOGLE_SHEET_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors', 
                    cache: 'no-cache', // Prevents browser from caching response
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data).toString(),
                });
                
                // Due to 'no-cors', response.ok will always be false and we can't read response.
                // We rely on the Apps Script to correctly log the data.
                console.log('Form submission initiated (check Google Sheet).');
                alert('Thank you for joining the BizScout Beta! We\'ll be in touch soon.');
                form.reset(); // Clear the form after successful submission
                // Optional: Redirect to a custom thank you page
                // window.location.href = '/thank-you.html'; 

            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was an error submitting your form. Please try again.');
            }
        } else {
            console.log('Form has validation errors. Please check highlighted fields.');
            // Optionally scroll to the first error
            const firstError = document.querySelector('.error-message[style*="block"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
