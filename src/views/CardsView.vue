<template>
  <div class="cards-view container">
    <header class="view-header">
      <div class="header-content">
        <h1>Meus Cartões</h1>
        <p>Gerencie seus cartões de crédito e débito</p>
      </div>
      <button class="btn-add" @click="openModal()">
        <span class="plus">+</span> Cadastrar Cartão
      </button>
    </header>

    <!-- Filters & Controls -->
    <div class="controls">
      <div class="filters">
        <button 
          class="filter-chip" 
          :class="{ active: filterType === 'all' }"
          @click="filterType = 'all'"
        >Todos</button>
        <button 
          class="filter-chip" 
          :class="{ active: filterType === 'credit' }"
          @click="filterType = 'credit'"
        >Crédito</button>
        <button 
          class="filter-chip" 
          :class="{ active: filterType === 'debit' }"
          @click="filterType = 'debit'"
        >Débito</button>
      </div>

      <div class="sort">
        <select v-model="sortBy">
          <option value="date-desc">Mais recentes</option>
          <option value="date-asc">Mais antigos</option>
          <option value="name-asc">Nome (A-Z)</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !cards.length" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando cartões...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!filteredCards.length && !isLoading" class="empty-state">
      <div class="empty-icon">💳</div>
      <h3>Nenhum cartão encontrado</h3>
      <p v-if="cards.length">Tente mudar os filtros de busca.</p>
      <p v-else>Você ainda não tem cartões cadastrados.</p>
      <button v-if="!cards.length" class="btn-add-secondary" @click="openModal()">
        Cadastrar Primeiro Cartão
      </button>
    </div>

    <!-- Cards Grid -->
    <div v-else class="cards-grid">
      <CardItem 
        v-for="card in filteredCards" 
        :key="card.id" 
        :card="card"
        @edit="openModal(card)"
        @delete="handleDelete"
      />
    </div>

    <!-- Modal Overlay -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <CardForm 
          :initial-data="editingCard" 
          :is-loading="isSaving"
          @submit="handleSave" 
          @cancel="closeModal" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CardItem from '../components/cards/CardItem.vue'
import CardForm from '../components/cards/CardForm.vue'
import { cardService } from '../services/cardService'

const cards = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showModal = ref(false)
const editingCard = ref(null)

const filterType = ref('all')
const sortBy = ref('date-desc')

const loadCards = async () => {
  isLoading.value = true
  try {
    cards.value = await cardService.getCards()
  } catch (error) {
    console.error('Erro ao carregar cartões:', error)
    alert('Erro ao carregar cartões.')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCards)

const filteredCards = computed(() => {
  let result = [...cards.value]

  // Filter
  if (filterType.value !== 'all') {
    result = result.filter(c => c.type === filterType.value)
  }

  // Sort
  result.sort((a, b) => {
    if (sortBy.value === 'name-asc') {
      return a.name.localeCompare(b.name)
    }
    const dateA = new Date(a.createdAt || 0)
    const dateB = new Date(b.createdAt || 0)
    
    if (sortBy.value === 'date-asc') return dateA - dateB
    return dateB - dateA // date-desc
  })

  return result
})

const openModal = (card = null) => {
  editingCard.value = card
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCard.value = null
}

const handleSave = async (formData) => {
  isSaving.value = true
  try {
    if (formData.id) {
      await cardService.updateCard(formData)
    } else {
      await cardService.createCard(formData)
    }
    await loadCards()
    closeModal()
  } catch (error) {
    alert(error.message)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este cartão?')) return

  try {
    await cardService.deleteCard(id)
    await loadCards()
  } catch (error) {
    alert(error.message)
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  font-size: 2rem;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.view-header p {
  color: var(--color-text);
}

.btn-add {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.btn-add:hover {
  background: var(--color-primary-dark, #0056b3);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
  background: var(--color-background-soft);
  padding: 0.25rem;
  border-radius: 8px;
}

.filter-chip {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s;
}

.filter-chip.active {
  background: var(--color-background);
  color: var(--color-primary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.sort select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--color-text);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.btn-add-secondary {
  margin-top: 1rem;
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--color-background);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@media (max-width: 640px) {
  .view-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters {
    justify-content: center;
  }
}
</style>
