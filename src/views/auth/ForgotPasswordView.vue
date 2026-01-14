<template>
  <AuthLayout title="Recuperar Senha" subtitle="Digite seu email para receber o link de redefinição">
    <form @submit.prevent="handleResetRequest" class="auth-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          v-model="email" 
          type="email" 
          :class="{ error: error }"
          @input="validate"
          placeholder="seu@email.com"
        />
        <span class="error-msg" v-if="error">{{ error }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="isSubmitting || !!error || !email">
          {{ isSubmitting ? 'Enviando...' : 'Enviar Link' }}
        </button>
      </div>

      <div class="form-footer">
        <router-link to="/login">Voltar para o Login</router-link>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import AuthLayout from '../../components/AuthLayout.vue'
import { useFormValidation } from '../../composables/useFormValidation'
import { authService } from '../../services/authService'

const { validateEmail } = useFormValidation()

const email = ref('')
const error = ref('')
const isSubmitting = ref(false)

const validate = () => {
  error.value = validateEmail(email.value)
}

const handleResetRequest = async () => {
  validate()
  if (error.value || !email.value) return

  isSubmitting.value = true
  try {
    const response = await authService.requestPasswordReset(email.value)
    if (response.success) {
      alert(response.message)
    }
  } catch (err) {
    alert(err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Reuse styles from RegisterView (could be extracted to global css or component) */
.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-weight: 500;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 189, 126, 0.1);
}

input.error {
  border-color: #ff4d4f;
}

.error-msg {
  color: #ff4d4f;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:disabled {
  background-color: var(--color-border);
  cursor: not-allowed;
}

.btn-primary:not(:disabled):hover {
  background-color: var(--color-primary-dark);
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
}

.form-footer a {
  color: var(--color-text);
  font-weight: 500;
}

.form-footer a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
