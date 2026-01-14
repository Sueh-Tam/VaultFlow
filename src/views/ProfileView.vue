<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="header">
        <h1>Meu Perfil</h1>
        <button v-if="!isEditing" @click="startEditing" class="btn-edit">
          Editar
        </button>
      </div>
      
      <!-- Feedback Messages -->
      <div v-if="successMessage" class="alert success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert error">{{ errorMessage }}</div>
      
      <div v-if="!isEditing">
        <div class="info-group">
          <label>Nome</label>
          <p>{{ user?.name || 'Usuário' }}</p>
        </div>

        <div class="info-group">
          <label>Email</label>
          <p>{{ user?.email || 'email@exemplo.com' }}</p>
        </div>

        <div class="actions">
          <button @click="handleLogout" class="btn-logout">Sair da Conta</button>
        </div>
      </div>

      <form v-else @submit.prevent="handleSave" class="edit-form">
        <div class="form-group">
          <label for="name">Nome</label>
          <input 
            id="name"
            v-model="editForm.name" 
            type="text" 
            :class="{ error: errors.name }"
            @blur="validateField('name')"
            placeholder="Seu nome completo"
          />
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="editForm.email" 
            type="email" 
            :class="{ error: errors.email }"
            @blur="validateField('email')"
            placeholder="seu@email.com"
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="actions-edit">
          <button type="button" @click="cancelEditing" class="btn-cancel" :disabled="isLoading">
            Cancelar
          </button>
          <button type="submit" class="btn-save" :disabled="isLoading">
            {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </form>
    </div>

    <div class="profile-card password-card">
      <div class="header">
        <h2>Alterar senha</h2>
      </div>

      <div v-if="passwordSuccessMessage" class="alert success">{{ passwordSuccessMessage }}</div>
      <div v-if="passwordErrorMessage" class="alert error">{{ passwordErrorMessage }}</div>

      <form @submit.prevent="handleChangePassword" class="password-form">
        <div class="form-group">
          <label for="currentPassword">Senha atual</label>
          <input
            id="currentPassword"
            v-model="passwordForm.currentPassword"
            type="password"
            :class="{ error: passwordErrors.currentPassword }"
            placeholder="Digite sua senha atual"
          />
          <span v-if="passwordErrors.currentPassword" class="error-text">{{ passwordErrors.currentPassword }}</span>
        </div>

        <div class="form-group">
          <label for="newPassword">Nova senha</label>
          <input
            id="newPassword"
            v-model="passwordForm.newPassword"
            type="password"
            :class="{ error: passwordErrors.newPassword }"
            placeholder="Digite a nova senha"
          />
          <span v-if="passwordErrors.newPassword" class="error-text">{{ passwordErrors.newPassword }}</span>

          <ul v-if="passwordRequirements.length" class="requirements-list">
            <li v-for="req in passwordRequirements" :key="req">{{ req }}</li>
          </ul>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar nova senha</label>
          <input
            id="confirmPassword"
            v-model="passwordForm.confirmPassword"
            type="password"
            :class="{ error: passwordErrors.confirmPassword }"
            placeholder="Repita a nova senha"
          />
          <span v-if="passwordErrors.confirmPassword" class="error-text">{{ passwordErrors.confirmPassword }}</span>
        </div>

        <div class="actions-edit">
          <button type="submit" class="btn-save" :disabled="isChangingPassword">
            {{ isChangingPassword ? 'Alterando...' : 'Alterar senha' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useFormValidation } from '../composables/useFormValidation'
import { authService } from '../services/authService'

const router = useRouter()
const { state, logout, setUser } = useAuth()
const { validateName, validateEmail, validatePassword, validateConfirmPassword } = useFormValidation()

const user = computed(() => state.user)

const isEditing = ref(false)
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const errors = reactive({})

const isChangingPassword = ref(false)
const passwordSuccessMessage = ref('')
const passwordErrorMessage = ref('')
const passwordRequirements = ref([])

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const editForm = reactive({
  name: '',
  email: ''
})

const startEditing = () => {
  editForm.name = user.value?.name || ''
  editForm.email = user.value?.email || ''
  successMessage.value = ''
  errorMessage.value = ''
  errors.name = ''
  errors.email = ''
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  errors.name = ''
  errors.email = ''
}

const validateField = (field) => {
  if (field === 'name') {
    errors.name = validateName(editForm.name)
  }
  if (field === 'email') {
    errors.email = validateEmail(editForm.email)
  }
}

const handleSave = async () => {
  // Validate all fields
  errors.name = validateName(editForm.name)
  errors.email = validateEmail(editForm.email)

  if (errors.name || errors.email) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await authService.updateUser({
      ...user.value,
      name: editForm.name,
      email: editForm.email
    })

    if (response.success) {
      setUser(response.user)
      successMessage.value = response.message
      setTimeout(() => {
        isEditing.value = false
        successMessage.value = ''
      }, 1000)
    }
  } catch (error) {
    errorMessage.value = error.message || 'Erro ao atualizar perfil'
  } finally {
    isLoading.value = false
  }
}

const handleChangePassword = async () => {
  passwordErrors.currentPassword = passwordForm.currentPassword ? '' : 'Senha atual é obrigatória.'

  const passwordValidation = validatePassword(passwordForm.newPassword)
  if (!passwordValidation.valid) {
    passwordErrors.newPassword = passwordValidation.message
    passwordRequirements.value = passwordValidation.requirements || []
  } else {
    passwordErrors.newPassword = ''
    passwordRequirements.value = []
  }

  passwordErrors.confirmPassword = validateConfirmPassword(passwordForm.newPassword, passwordForm.confirmPassword)

  if (passwordErrors.currentPassword || passwordErrors.newPassword || passwordErrors.confirmPassword) {
    return
  }

  isChangingPassword.value = true
  passwordErrorMessage.value = ''
  passwordSuccessMessage.value = ''

  try {
    const response = await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    if (response.success) {
      passwordSuccessMessage.value = response.message
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      passwordRequirements.value = []
    }
  } catch (error) {
    passwordErrorMessage.value = error.message || 'Erro ao alterar senha'
  } finally {
    isChangingPassword.value = false
  }
}

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.password-card {
  margin-top: 1.5rem;
}

.header {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  font-size: 1.5rem;
  color: var(--color-heading);
  font-weight: 700;
}

.btn-edit {
  background-color: var(--color-primary, #007bff);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-edit:hover {
  background-color: var(--color-primary-dark, #0056b3);
}

.info-group, .form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

p {
  font-size: 1.1rem;
  color: var(--color-heading);
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--color-primary, #007bff);
}

input.error {
  border-color: #ff4d4f;
}

.error-text {
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.actions {
  margin-top: 2rem;
  border-top: 1px solid var(--color-border);
  padding-top: 1rem;
}

.actions-edit {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.btn-logout {
  background-color: transparent;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-logout:hover {
  background-color: #ff4d4f;
  color: white;
}

.btn-save {
  background-color: #10b981; /* Green */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-save:disabled {
  background-color: #6ee7b7;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.alert {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.alert.success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert.error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.requirements-list {
  margin-top: 0.5rem;
  padding-left: 1.25rem;
  font-size: 0.85rem;
  color: var(--color-text);
}
</style>
