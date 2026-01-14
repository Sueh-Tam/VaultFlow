import { describe, it, expect } from 'vitest'
import { useFormValidation } from '../useFormValidation'

describe('useFormValidation', () => {
  const { validatePassword, validateEmail, validateConfirmPassword } = useFormValidation()

  describe('validatePassword', () => {
    it('should validate correct password', () => {
      const result = validatePassword('SenhaForte1!')
      expect(result.valid).toBe(true)
    })

    it('should fail short password', () => {
      const result = validatePassword('Curta1!')
      expect(result.valid).toBe(false)
      expect(result.requirements).toContain('Mínimo de 8 caracteres')
    })

    it('should fail missing uppercase', () => {
      const result = validatePassword('senhaforte1!')
      expect(result.valid).toBe(false)
      expect(result.requirements).toContain('Pelo menos 1 letra maiúscula')
    })

    it('should fail missing lowercase', () => {
      const result = validatePassword('SENHAFORTE1!')
      expect(result.valid).toBe(false)
      expect(result.requirements).toContain('Pelo menos 1 letra minúscula')
    })

    it('should fail missing number', () => {
      const result = validatePassword('SenhaForte!')
      expect(result.valid).toBe(false)
      expect(result.requirements).toContain('Pelo menos 1 número')
    })

    it('should fail missing special char', () => {
      const result = validatePassword('SenhaForte1')
      expect(result.valid).toBe(false)
      expect(result.requirements).toContain('Pelo menos 1 caractere especial')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('teste@exemplo.com')).toBe('')
    })

    it('should fail invalid email', () => {
      expect(validateEmail('teste.com')).toBe('Formato de email inválido.')
    })

    it('should fail empty email', () => {
      expect(validateEmail('')).toBe('Email é obrigatório.')
    })
  })

  describe('validateConfirmPassword', () => {
    it('should pass matching passwords', () => {
      expect(validateConfirmPassword('123', '123')).toBe('')
    })

    it('should fail non-matching passwords', () => {
      expect(validateConfirmPassword('123', '321')).toBe('As senhas não coincidem.')
    })
  })
})
