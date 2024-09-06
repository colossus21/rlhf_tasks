export default {
    contactListElement: document.getElementById('contactList'),
    errorMessageElement: document.getElementById('errorMessage'),

    render(contacts) {
        this.contactListElement.innerHTML = contacts.map(contact => `
            <li class="contact-item">
                <span>Name: ${contact.name}, Email: ${contact.email}</span>
                <button class="delete-btn" data-id="${contact.id}">Delete</button>
            </li>
        `).join('');

        // Adding event listeners dynamically
        this.contactListElement.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', e => this.handleDelete(e));
        });
    },

    handleDelete(event) {
        // This would typically call a controller method
        console.log('Delete requested for:', event.target.dataset.id);
    },

    showError(message) {
        this.errorMessageElement.textContent = message;
    },

    clearError() {
        this.errorMessageElement.textContent = '';
    }
};