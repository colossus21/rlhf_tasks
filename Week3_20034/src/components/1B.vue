<template>
  <div class="complaint-form">
    <h2>Submit a Complaint</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name</label>
        <input
            type="text"
            id="name"
            v-model="form.name"
            placeholder="Enter your name"
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
            placeholder="Enter your email"
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
            placeholder="Describe your complaint"
            :class="{ 'invalid': errors.complaint }"
            aria-invalid="false"
        ></textarea>
        <span v-if="errors.complaint" class="error-message">{{ errors.complaint }}</span>
      </div>

      <button type="submit">Submit</button>
    </form>

    <div v-if="submitted" class="feedback-message" :key="submitted">
      <p>Thank you for your submission!</p>
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
      errors: {}
    };
  },
  methods: {
    submitForm() {
      this.errors = this.validateForm();
      if (Object.keys(this.errors).length === 0) {
        console.log('Form data:', this.form);
        this.submitted = true;
        // Reset form
        this.form = { name: '', email: '', complaint: '' };
        setTimeout(() => {
          this.submitted = false;
        }, 3000);
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
    }
  }
};
</script>

<style scoped>
/* Your existing styles here */
.error-message {
  color: #dc3545;
  font-size: 0.875em;
  display: block;
  margin-top: 5px;
}

.invalid {
  border-color: #dc3545;
}

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

.feedback-message {
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid #28a745;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
}
</style>