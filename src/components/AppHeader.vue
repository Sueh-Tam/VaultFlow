<template>
  <header class="app-header">
    <div class="container">
      <router-link to="/" class="logo">
        <img alt="VaultFlow logo" class="logo-img" src="@/assets/logo.svg" width="32" height="32" />
        <span class="brand-name">VaultFlow</span>
      </router-link>

      <div v-if="state.isAuthenticated" class="user-menu" ref="menuRef">
        <button @click="toggleMenu" class="menu-btn">
          Menu 
          <span class="arrow" :class="{ open: isMenuOpen }">▼</span>
        </button>
        
        <div v-show="isMenuOpen" class="dropdown">
          <router-link to="/profile" class="dropdown-item" @click="closeMenu">
            Meu Perfil
          </router-link>
          
          <router-link to="/cards" class="dropdown-item" @click="closeMenu">
            Meus Cartões
          </router-link>
          
          <div class="dropdown-item disabled">
            Finanças
          </div>
          
          <div class="divider"></div>
          
          <button @click="handleLogout" class="dropdown-item logout">
            Sair
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { state, logout } = useAuth()
const isMenuOpen = ref(false)
const menuRef = ref(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = () => {
  logout()
  closeMenu()
  router.push('/login')
}

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.9);
}

@media (prefers-color-scheme: dark) {
  .app-header {
    background: rgba(24, 24, 24, 0.9);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between; /* Changed to space-between */
  align-items: center;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.brand-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-heading);
  letter-spacing: -0.5px;
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Menu Styles */
.user-menu {
  position: relative;
}

.menu-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-heading);
  transition: all 0.2s;
}

.menu-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.arrow {
  font-size: 0.7rem;
  transition: transform 0.2s;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  width: 200px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 0.5rem 0;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  font-size: 0.95rem;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover:not(.disabled) {
  background-color: var(--color-background-soft);
  color: var(--color-primary);
}

.dropdown-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0.5rem 0;
}

.logout {
  color: #ff4d4f;
}

.logout:hover {
  color: #ff4d4f;
  background-color: rgba(255, 77, 79, 0.1);
}
</style>
