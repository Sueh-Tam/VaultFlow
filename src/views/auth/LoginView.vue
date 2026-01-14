<template>
  <AuthLayout title="Bem-vindo de volta" subtitle="Acesse sua conta para gerenciar suas finanças">
    <form @submit.prevent="handleLogin" class="auth-form">
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
          placeholder="Sua senha"
        />
        <span class="error-msg" v-if="errors.password">{{ errors.password }}</span>
      </div>

      <div class="forgot-password">
        <router-link to="/forgot-password">Esqueceu a senha?</router-link>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="isSubmitting || hasErrors">
          {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
        </button>
      </div>

      <div class="form-footer">
        <p>Não tem uma conta? <router-link to="/register">Cadastre-se</router-link></p>
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
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { validateEmail } = useFormValidation()
const { setUser } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const isSubmitting = ref(false)

const validateField = (field) => {
  if (field === 'email') {
    errors.email = validateEmail(form.email)
  }
  if (field === 'password') {
    errors.password = !form.password ? 'Senha é obrigatória.' : ''
  }
}

const hasErrors = computed(() => {
  return !!errors.email || !!errors.password || !form.email || !form.password
})

const handleLogin = async () => {
  validateField('email')
  validateField('password')
  if (hasErrors.value) return

  isSubmitting.value = true
  try {
    const response = await authService.login(form)
    if (response.success) {
      setUser(response.user)
      router.push('/')
    }
  } catch (err) {
    alert('Login falhou: ' + err.message)
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
.btn-primary { width: 100%; padding: 0.875rem; background-color: var(--color-primary); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background-color 0.3s; }
.btn-primary:disabled { background-color: var(--color-border); cursor: not-allowed; }
.btn-primary:not(:disabled):hover { background-color: var(--color-primary-dark); }
.form-footer { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; }
.form-footer a { color: var(--color-primary); font-weight: 600; }
.form-footer a:hover { text-decoration: underline; }
.forgot-password { text-align: right; margin-top: -1rem; margin-bottom: 1.5rem; }
.forgot-password a { font-size: 0.85rem; color: var(--color-text); }
.forgot-password a:hover { color: var(--color-primary); }
</style>
