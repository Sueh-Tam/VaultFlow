import { ref, computed } from 'vue'

export function useFormValidation() {
  const errors = ref({})

  const validateName = (name) => {
    if (!name) return 'Nome é obrigatório.'
    if (name.length < 3) return 'Nome deve ter pelo menos 3 caracteres.'
    return ''
  }

  const validateEmail = (email) => {
    if (!email) return 'Email é obrigatório.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Formato de email inválido.'
    return ''
  }

  const validatePassword = (password) => {
    const requirements = []
    if (!password) return { valid: false, message: 'Senha é obrigatória.' }
    
    if (password.length < 8) requirements.push('Mínimo de 8 caracteres')
    if (!/[A-Z]/.test(password)) requirements.push('Pelo menos 1 letra maiúscula')
    if (!/[a-z]/.test(password)) requirements.push('Pelo menos 1 letra minúscula')
    if (!/[0-9]/.test(password)) requirements.push('Pelo menos 1 número')
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) requirements.push('Pelo menos 1 caractere especial')

    if (requirements.length > 0) {
      return { 
        valid: false, 
        message: 'A senha não atende aos requisitos.',
        requirements 
      }
    }
    
    return { valid: true, message: '' }
  }

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Confirmação de senha é obrigatória.'
    if (password !== confirmPassword) return 'As senhas não coincidem.'
    return ''
  }

  return {
    errors,
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword
  }
}
