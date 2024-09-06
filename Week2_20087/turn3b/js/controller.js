export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindDeleteContact(this.handleDeleteContact);
        this.init();
    }

    init() {
        document.getElementById('contactForm').addEventListener('submit', this.handleSubmit.bind(this));
        document.getElementById('searchBar').addEventListener('input', this.handleSearch.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        this.addContact(name, email);
    }

    addContact(name, email) {
        this.view.clearError();
        const success = this.model.addContact({name, email});
        if (success) {
            this.view.render(this.model.contacts);
            document.getElementById('contactForm').reset();
        } else {
            this.view.showError('Failed to add contact. Please check the name and email.');
        }
    }

    handleDeleteContact = (id) => {
        this.model.deleteContact(id);
        this.view.render(this.model.contacts);
    }

    handleSearch(event) {
        const query = event.target.value;
        const filteredContacts = this.model.searchContacts(query);
        this.view.render(filteredContacts);
    }
}