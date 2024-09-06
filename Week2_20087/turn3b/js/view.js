export default class View {
    constructor() {
        this.contactListElement = document.getElementById('contactList');
        this.errorMessageElement = document.getElementById('errorMessage');
    }

    render(contacts) {
        this.contactListElement.innerHTML = contacts.map(contact => 
            `<li class="contact-item">
                <span>Name: ${contact.name}, Email: ${contact.email}</span>
                <button class="delete-btn" data-id="${contact.id}">Delete</button>
             </li>`
        ).join('');
    }

    bindDeleteContact(handler) {
        this.contactListElement.addEventListener('click', event => {
            if (event.target.className === 'delete-btn') {
                const id = parseInt(event.target.dataset.id);
                handler(id);
            }
        });
    }

    showError(message) {
        this.errorMessageElement.textContent = message;
    }

    clearError() {
        this.errorMessageElement.textContent = '';
    }
}