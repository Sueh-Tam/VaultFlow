<template>
  <div class="card-form">
    <h3>{{ isEditing ? 'Editar Cartão' : 'Novo Cartão' }}</h3>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="cardName">Nome do Cartão</label>
        <input 
          id="cardName"
          v-model="form.name"
          type="text"
          placeholder="Ex: Nubank, Inter"
          :class="{ error: errors.name }"
          @blur="validateField('name')"
        />
        <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label for="network">Bandeira</label>
          <select id="network" v-model="form.network">
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="elo">Elo</option>
            <option value="amex">Amex</option>
            <option value="hipercard">Hipercard</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div class="form-group half">
          <label for="last4">Últimos 4 dígitos</label>
          <input 
            id="last4"
            v-model="form.last4Digits"
            type="text"
            maxlength="4"
            placeholder="1234"
            @input="filterNumbers"
          />
        </div>
      </div>

      <div class="form-group">
        <label>Tipo</label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" value="credit" v-model="form.type">
            <span>Crédito</span>
          </label>
          <label class="radio-label">
            <input type="radio" value="debit" v-model="form.type">
            <span>Débito</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Cor do Cartão</label>
        <div class="color-picker">
          <button 
            v-for="color in colors" 
            :key="color"
            type="button"
            class="color-swatch"
            :style="{ backgroundColor: color }"
            :class="{ selected: form.color === color }"
            @click="form.color = color"
          ></button>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="btn-save" :disabled="isLoading">
          {{ isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEditing = ref(!!props.initialData)

const colors = [
  '#1a1a1a', // Black
  '#820ad1', // Nubank Purple
  '#ff4f00', // Inter Orange
  '#0056b3', // Blue
  '#dc2626', // Red
  '#059669', // Green
  '#d97706', // Gold
  '#db2777'  // Pink
]

const form = reactive({
  id: null,
  name: '',
  network: 'mastercard',
  type: 'credit',
  last4Digits: '',
  color: '#1a1a1a'
})

const errors = reactive({
  name: ''
})

// Populate form if editing
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.id = newData.id
    form.name = newData.name
    form.network = newData.network
    form.type = newData.type
    form.last4Digits = newData.last4Digits || ''
    form.color = newData.color || '#1a1a1a'
    isEditing.value = true
  } else {
    resetForm()
    isEditing.value = false
  }
}, { immediate: true })

function resetForm() {
  form.id = null
  form.name = ''
  form.network = 'mastercard'
  form.type = 'credit'
  form.last4Digits = ''
  form.color = '#1a1a1a'
}

const filterNumbers = (e) => {
  form.last4Digits = e.target.value.replace(/\D/g, '').slice(0, 4)
}

const validateField = (field) => {
  if (field === 'name') {
    errors.name = !form.name ? 'Nome do cartão é obrigatório' : ''
  }
}

const handleSubmit = () => {
  validateField('name')
  
  if (errors.name) return

  emit('submit', { ...form })
}
</script>

<style scoped>
.card-form {
  background: var(--color-background);
  padding: 1rem;
}

h3 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.half {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 1rem;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.error {
  border-color: #ff4d4f;
}

.error-msg {
  color: #ff4d4f;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.color-picker {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.selected {
  border-color: var(--color-heading);
  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-save {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
