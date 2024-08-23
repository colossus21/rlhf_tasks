export default class Model {
    constructor() {
        this.contacts = [];
    }

    addContact(contact) {
        if (contact.name && this.isValidEmail(contact.email)) {
            this.contacts = [{ ...contact, id: Date.now() }, ...this.contacts];
            return true;
        }
        return false;
    }

    deleteContact(id) {
        this.contacts = this.contacts.filter(contact => contact.id !== id);
    }

    searchContacts(query) {
        return this.contacts.filter(contact => 
            contact.name.toLowerCase().includes(query.toLowerCase()) ||
            contact.email.toLowerCase().includes(query.toLowerCase())
        );
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}