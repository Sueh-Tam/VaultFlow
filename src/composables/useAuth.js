import { reactive, readonly } from 'vue'

const state = reactive({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user')
})

const setUser = (user) => {
  state.user = user
  state.isAuthenticated = !!user
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
}

const logout = () => {
  setUser(null)
}

export function useAuth() {
  return {
    state: readonly(state),
    setUser,
    logout
  }
}
