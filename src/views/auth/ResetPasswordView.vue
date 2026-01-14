<template>
  <AuthLayout title="Redefinir Senha" subtitle="Crie uma nova senha segura">
    <form @submit.prevent="handleReset" class="auth-form">
      <div class="form-group">
        <label for="password">Nova Senha</label>
        <input 
          id="password" 
          v-model="password" 
          type="password" 
          :class="{ error: errors.password }"
          @input="validateField('password')"
          placeholder="Nova senha forte"
        />
        <!-- Password Strength Indicators -->
        <div class="password-requirements" v-if="password">
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
        <label for="confirmPassword">Confirmar Nova Senha</label>
        <input 
          id="confirmPassword" 
          v-model="confirmPassword" 
          type="password" 
          :class="{ error: errors.confirmPassword }"
          @input="validateField('confirmPassword')"
          placeholder="Repita a nova senha"
        />
        <span class="error-msg" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="isSubmitting || hasErrors">
          {{ isSubmitting ? 'Redefinindo...' : 'Salvar Nova Senha' }}
        </button>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthLayout from '../../components/AuthLayout.vue'
import { useFormValidation } from '../../composables/useFormValidation'
import { authService } from '../../services/authService'

const router = useRouter()
const route = useRoute()
const { validatePassword, validateConfirmPassword } = useFormValidation()

const password = ref('')
const confirmPassword = ref('')
const hasMinLength = computed(() => password.value.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasLowercase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))
const hasSpecialChar = computed(() => /[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]/.test(password.value))
const errors = reactive({
  password: '',
  confirmPassword: ''
})
const isSubmitting = ref(false)

// Token from URL query param
const token = route.query.token

const validateField = (field) => {
  if (field === 'password') {
    const pwCheck = validatePassword(password.value)
    errors.password = pwCheck.valid ? '' : 'Requisitos não atendidos'
    if (confirmPassword.value) validateField('confirmPassword')
  } else if (field === 'confirmPassword') {
    errors.confirmPassword = validateConfirmPassword(password.value, confirmPassword.value)
  }
}

const hasErrors = computed(() => {
  const pwValid = validatePassword(password.value).valid
  const matchValid = !validateConfirmPassword(password.value, confirmPassword.value)
  return !pwValid || !matchValid || !password.value || !confirmPassword.value
})

const handleReset = async () => {
  if (hasErrors.value) return

  isSubmitting.value = true
  try {
    const response = await authService.resetPassword(token, password.value)
    if (response.success) {
      alert(response.message)
      router.push('/login')
    }
  } catch (err) {
    alert(err.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Reuse styles */
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; color: var(--color-heading); font-weight: 500; font-size: 0.9rem; }
input { width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: 8px; background: var(--color-background); color: var(--color-text); font-size: 1rem; transition: border-color 0.3s; }
input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(0, 189, 126, 0.1); }
input.error { border-color: #ff4d4f; }
.error-msg { color: #ff4d4f; font-size: 0.85rem; margin-top: 0.25rem; display: block; }
.password-requirements { margin-top: 0.75rem; padding: 0.75rem; background: var(--color-background-mute); border-radius: 8px; font-size: 0.85rem; }
.req-title { margin-bottom: 0.5rem; font-weight: 600; color: var(--color-heading); }
.password-requirements ul { list-style: none; padding: 0; margin: 0; }
.password-requirements li { display: flex; align-items: center; gap: 0.5rem; color: var(--color-text); margin-bottom: 0.25rem; }
.password-requirements li.met { color: var(--color-primary); }
.icon { font-weight: bold; }
.btn-primary { width: 100%; padding: 0.875rem; background-color: var(--color-primary); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background-color 0.3s; }
.btn-primary:disabled { background-color: var(--color-border); cursor: not-allowed; }
.btn-primary:not(:disabled):hover { background-color: var(--color-primary-dark); }
</style>
