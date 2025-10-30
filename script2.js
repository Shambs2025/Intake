document.getElementById('eventRequestForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const messageElement = document.getElementById('message');
    
    // Collect form data. The keys here (e.g., 'eventName') must match 
    // what you map in Zapier.
    const formData = {
        requesterName: document.getElementById('requesterName').value,
        requesterEmail: document.getElementById('requesterEmail').value,
        eventName: document.getElementById('eventName').value,
        eventType: document.getElementById('eventType').value,
        eventDate: document.getElementById('eventDate').value,
        eventTime: document.getElementById('eventTime').value,
        attendance: document.getElementById('attendance').value,
        description: document.getElementById('description').value
    };

    // 🛑 IMPORTANT: PASTE YOUR ZAPIER WEBHOOK URL HERE 
    // This is the URL Zapier provides when you set up the "Catch Hook" trigger.
    const ZAPIER_WEBHOOK_URL = 'YOUR_ZAPIER_WEBHOOK_URL_HERE'; 

    // Visual feedback while submitting
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    messageElement.classList.add('hidden');

    fetch(ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            // Tell the server we are sending JSON data
            'Content-Type': 'application/json',
        },
        // Convert the JavaScript object to a JSON string
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            // SUCCESS HANDLING: If Zapier accepts the request (200 status code)
            messageElement.textContent = 'Thank you! Your event request has been successfully submitted.';
            messageElement.className = 'success';
            form.reset(); // Clear the form fields for a new entry
        } else {
            // Handle Zapier-side error (e.g., API key, authorization issue)
            throw new Error(`Submission failed. Check your Zapier configuration. Status: ${response.status}`);
        }
    })
    .catch(error => {
        // ERROR HANDLING: If the network request fails
        console.error('Submission Error:', error);
        messageElement.textContent = 'An unexpected error occurred. Please try again.';
        messageElement.className = 'error';
    })
    .finally(() => {
        // Reset button state and show message regardless of success or failure
        submitBtn.textContent = 'Submit Request';
        submitBtn.disabled = false;
        messageElement.classList.remove('hidden');
    });
});
