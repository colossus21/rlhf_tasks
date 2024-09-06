export default {
    contacts: [],

    addContact(contact) {
        if (contact.name && this.isValidEmail(contact.email)) {
            this.contacts = [{...contact, id: Date.now()}, ...this.contacts];
            return true;
        }
        return false;
    },

    deleteContact(id) {
        this.contacts = this.contacts.filter(contact => contact.id !== id);
    },

    searchContacts(query) {
        query = query.toLowerCase();
        return this.contacts.filter(contact => 
            contact.name.toLowerCase().includes(query) || 
            contact.email.toLowerCase().includes(query)
        );
    },

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};