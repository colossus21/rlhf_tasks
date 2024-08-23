<template>
  <div class="complaint-form">
    <div v-if="!submitted">
      <h2>Submit a Complaint</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input
              type="text"
              id="name"
              v-model="form.name"
              :class="{ 'invalid': errors.name }"
              aria-invalid="false"
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
              type="email"
              id="email"
              v-model="form.email"
              :class="{ 'invalid': errors.email }"
              aria-invalid="false"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="complaint">Complaint</label>
          <textarea
              id="complaint"
              v-model="form.complaint"
              :class="{ 'invalid': errors.complaint }"
              aria-invalid="false"
          ></textarea>
          <span v-if="errors.complaint" class="error-message">{{ errors.complaint }}</span>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>

    <div v-else class="submission-preview">
      <h2>Thank you for submitting your complaint.</h2>
      <h3>Submission Preview:</h3>
      <div class="preview-item">
        <strong>Name:</strong> {{ submittedForm.name }}
      </div>
      <div class="preview-item">
        <strong>Email:</strong> {{ submittedForm.email }}
      </div>
      <div class="preview-item">
        <strong>Complaint:</strong> {{ submittedForm.complaint }}
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Confirm Submission</h3>
        <p>Your complaint has been received. Before we process it:</p>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="isAnonymous">
            Do you want to submit the form anonymously?
          </label>
        </div>
        <div class="modal-actions">
          <button @click="confirmSubmission">Confirm</button>
          <button @click="cancelSubmission">Cancel</button>
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
      submittedForm: {},
      errors: {},
      showModal: false,
      isAnonymous: false,
      submitted: false
    };
  },
  methods: {
    submitForm() {
      this.errors = this.validateForm();
      if (Object.keys(this.errors).length === 0) {
        this.showModal = true;
      }
    },
    validateForm() {
      let errors = {};
      if (!this.form.name) errors.name = 'Name is required';
      if (!this.form.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        errors.email = 'Email format is invalid';
      }
      if (!this.form.complaint) errors.complaint = 'Complaint is required';
      return errors;
    },
    confirmSubmission() {
      this.submittedForm = { ...this.form };
      this.submitted = true;
      this.showModal = false;
    },
    cancelSubmission() {
      this.showModal = false;
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

.form-group {
  margin-bottom: 1rem;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #dc3545;
  font-size: 0.875em;
  display: block;
  margin-top: 5px;
}

.invalid {
  border-color: #dc3545;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.modal-actions button {
  margin-left: 0.5rem;
}

.submission-preview {
  background-color: #e9ecef;
  padding: 1rem;
  border-radius: 5px;
}

.preview-item {
  margin-bottom: 0.5rem;
}

.preview-item strong {
  margin-right: 0.5rem;
}
</style>