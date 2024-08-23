import model from '../model/contactModel.js';
import view from '../view/contactView.js';

export default {
    init() {
        document.getElementById('contactForm').addEventListener('submit', this.handleSubmit.bind(this));
        document.getElementById('searchBar').addEventListener('input', this.handleSearch.bind(this));
    },

    handleSubmit(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        if (model.addContact({name, email})) {
            view.render(model.contacts);
            event.target.reset();
        } else {
            view.showError('Failed to add contact. Please check the name and email.');
        }
    },

    deleteContact(id) {
        model.deleteContact(id);
        view.render(model.contacts);
    },

    handleSearch(event) {
        const filteredContacts = model.searchContacts(event.target.value);
        view.render(filteredContacts);
    }
};

// Link the view's delete handler to the controller
view.handleDelete = (e) => this.deleteContact(parseInt(e.target.dataset.id));