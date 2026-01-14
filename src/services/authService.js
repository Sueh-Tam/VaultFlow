// Simulação de delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const USERS_KEY = 'vaultflow_users'

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const storeUser = (user) => {
  const users = getStoredUsers().filter(u => u.email !== user.email)
  users.push({ name: user.name, email: user.email })
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const authService = {
  async register(userData) {
    await delay(1000) // Simula tempo de resposta
    
    // Simulação básica de erro se email for "erro@teste.com"
    if (userData.email === 'erro@teste.com') {
      throw new Error('Este email já está em uso.')
    }
    
    storeUser({ name: userData.name, email: userData.email })
    console.log('Usuário registrado:', userData)
    return { success: true, message: 'Usuário cadastrado com sucesso!' }
  },

  async login(credentials) {
    await delay(1000)
    const users = getStoredUsers()
    const existing = users.find(u => u.email === credentials.email)
    const fallbackName = credentials.email?.split('@')[0] || 'Usuário'
    const user = existing || { name: fallbackName, email: credentials.email }
    console.log('Login:', credentials)
    return { success: true, token: 'fake-jwt-token', user }
  },

  async requestPasswordReset(email) {
    await delay(1000)
    if (email === 'naoexiste@teste.com') {
      throw new Error('Email não encontrado.')
    }
    console.log('Email de recuperação enviado para:', email)
    return { success: true, message: 'Link de recuperação enviado para seu email.' }
  },

  async resetPassword(token, newPassword) {
    await delay(1000)
    console.log('Senha redefinida com token:', token)
    return { success: true, message: 'Senha redefinida com sucesso.' }
  },

  async changePassword(currentPassword, newPassword) {
    await delay(1000)
    console.log('Senha alterada:', { currentPassword, newPassword })
    return { success: true, message: 'Senha alterada com sucesso.' }
  },

  async updateUser(userData) {
    await delay(1000)
    storeUser(userData)
    console.log('Dados atualizados:', userData)
    return { 
      success: true, 
      user: userData,
      message: 'Perfil atualizado com sucesso!' 
    }
  }
}
