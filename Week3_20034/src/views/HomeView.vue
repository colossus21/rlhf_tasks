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
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label for="complaint">Complaint</label>
        <textarea
            id="complaint"
            v-model="form.complaint"
            placeholder="Describe your complaint"
        ></textarea>
      </div>

      <button type="submit">Submit</button>
    </form>

    <div v-if="submitted" class="feedback-message">
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
    };
  },
  methods: {
    submitForm() {
      if (this.validateForm()) {
        console.log('Form data:', this.form);
        this.submitted = true;
        this.form.name = '';
        this.form.email = '';
        this.form.complaint = '';
        setTimeout(() => {
          this.submitted = false;
        }, 3000);
      } else {
        alert('Please fill out all fields.');
      }
    },
    validateForm() {
      return this.form.name && this.form.email && this.form.complaint;
    },
  },
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

.feedback-message {
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid #28a745;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
}
</style>