<template>
  <AuthLayout title="Crie sua conta" subtitle="Comece a controlar suas finanças hoje mesmo">
    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="form-group">
        <label for="name">Nome Completo</label>
        <input 
          id="name" 
          v-model="form.name" 
          type="text" 
          :class="{ error: errors.name }"
          @blur="validateField('name')"
          placeholder="Seu nome"
        />
        <span class="error-msg" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          v-model="form.email" 
          type="email" 
          :class="{ error: errors.email }"
          @blur="validateField('email')"
          placeholder="seu@email.com"
        />
        <span class="error-msg" v-if="errors.email">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input 
          id="password" 
          v-model="form.password" 
          type="password" 
          :class="{ error: errors.password }"
          @input="validateField('password')"
          placeholder="Sua senha forte"
        />
        <!-- Password Strength Indicators -->
        <div class="password-requirements" v-if="form.password">
          <p class="req-title">Sua senha deve conter:</p>
          <ul>
            <li :class="{ met: hasMinLength }">
              <span class="icon">{{ hasMinLength ? '✓' : '○' }}</span> Mínimo de 8 caracteres
            </li>
            <li :class="{ met: hasUppercase }">
              <span class="icon">{{ hasUppercase ? '✓' : '○' }}</span> 1 letra maiúscula
            </li>
            <li :class="{ met: hasLowercase }">
              <span class="icon">{{ hasLowercase ? '✓' : '○' }}</span> 1 letra minúscula
            </li>
            <li :class="{ met: hasNumber }">
              <span class="icon">{{ hasNumber ? '✓' : '○' }}</span> 1 número
            </li>
            <li :class="{ met: hasSpecialChar }">
              <span class="icon">{{ hasSpecialChar ? '✓' : '○' }}</span> 1 caractere especial
            </li>
          </ul>
        </div>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input 
          id="confirmPassword" 
          v-model="form.confirmPassword" 
          type="password" 
          :class="{ error: errors.confirmPassword }"
          @input="validateField('confirmPassword')"
          placeholder="Repita a senha"
        />
        <span class="error-msg" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="isSubmitting || hasErrors">
          {{ isSubmitting ? 'Criando conta...' : 'Cadastrar' }}
        </button>
      </div>

      <div class="form-footer">
        <p>Já tem uma conta? <router-link to="/login">Faça Login</router-link></p>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../../components/AuthLayout.vue'
import { useFormValidation } from '../../composables/useFormValidation'
import { authService } from '../../services/authService'

const router = useRouter()
const { validateName, validateEmail, validatePassword, validateConfirmPassword } = useFormValidation()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const hasMinLength = computed(() => form.password.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(form.password))
const hasLowercase = computed(() => /[a-z]/.test(form.password))
const hasNumber = computed(() => /[0-9]/.test(form.password))
const hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]/.test(form.password))

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isSubmitting = ref(false)

const validateField = (field) => {
  switch (field) {
    case 'name':
      errors.name = validateName(form.name)
      break
    case 'email':
      errors.email = validateEmail(form.email)
      break
    case 'password':
      const pwCheck = validatePassword(form.password)
      // We don't show the error text for password as we have the visual list, 
      // but we need to track validity for the submit button
      errors.password = pwCheck.valid ? '' : 'Requisitos não atendidos'
      if (form.confirmPassword) validateField('confirmPassword')
      break
    case 'confirmPassword':
      errors.confirmPassword = validateConfirmPassword(form.password, form.confirmPassword)
      break
  }
}

const hasErrors = computed(() => {
  // Check if any error strings exist OR if fields are empty
  const hasErrorMsg = Object.values(errors).some(msg => msg !== '')
  const hasEmptyFields = !form.name || !form.email || !form.password || !form.confirmPassword
  
  // Also explicitly re-check password validity to be safe
  const pwValid = validatePassword(form.password).valid
  
  return hasErrorMsg || hasEmptyFields || !pwValid
})

const handleRegister = async () => {
  // Validate all before submit
  validateField('name')
  validateField('email')
  validateField('password')
  validateField('confirmPassword')

  if (hasErrors.value) return

  isSubmitting.value = true
  try {
    const response = await authService.register(form)
    if (response.success) {
      alert(response.message) // In a real app, use a toast notification
      router.push('/login')
    }
  } catch (error) {
    alert(error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
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

.password-requirements {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: var(--color-background-mute);
  border-radius: 8px;
  font-size: 0.85rem;
}

.req-title {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  transition: color 0.3s;
}

.password-requirements li.met {
  color: var(--color-primary);
}

.icon {
  font-weight: bold;
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
  color: var(--color-primary);
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style>
