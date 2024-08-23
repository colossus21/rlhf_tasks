<template>
  <div class="complaint-form">
    <h2>Submit a Complaint</h2>
    <form @submit.prevent="submitForm">
      <!-- Form fields as before -->
      <div class="form-group">
        <label for="name">Name</label>
        <input
            type="text"
            id="name"
            v-model="form.name"
            :class="{ 'invalid': errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>
      <!-- Email and Complaint fields similar to above -->

      <button type="submit">Submit</button>
    </form>

    <!-- Feedback Message -->
    <div v-if="submitted" class="feedback-message" :key="submitted">
      <p>Thank you for your submission!</p>
    </div>

    <!-- Modal for Confirmation -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Confirm Submission</h3>
        <p>Are you sure you want to submit this complaint?</p>
        <label>
          <input type="checkbox" v-model="isAnonymous"> Submit anonymously?
        </label>
        <div>
          <button @click="confirmSubmission">Confirm</button>
          <button @click="showModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        complaint: '',
      },
      submitted: false,
      errors: {},
      showModal: false,
      isAnonymous: false
    };
  },
  methods: {
    submitForm() {
      this.errors = this.validateForm();
      if (Object.keys(this.errors).length === 0) {
        this.showModal = true; // Show modal for confirmation
      }
    },
    validateForm() {
      // ... (validation logic as before)
    },
    confirmSubmission() {
      const formToSubmit = { ...this.form, anonymous: this.isAnonymous };
      console.log('Submitted Form:', formToSubmit);
      this.showModal = false;
      this.submitted = true;
      this.resetForm();
      setTimeout(() => this.submitted = false, 3000);
    },
    resetForm() {
      this.form = { name: '', email: '', complaint: '' };
      this.isAnonymous = false;
    }
  }
};
</script>

<style scoped>
.complaint-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

/* Modal styles */
.modal {
  display: block; /* Shown by default with v-if */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
}

/* Button styles */
button {
  padding: 0.5rem 1rem;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* Error message style */
.error-message {
  color: #dc3545;
  font-size: 0.875em;
  display: block;
  margin-top: 5px;
}

.invalid {
  border-color: #dc3545;
}

/* Feedback message */
.feedback-message {
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid #28a745;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
}
</style>