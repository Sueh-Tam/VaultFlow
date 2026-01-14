
const CARDS_KEY = 'vaultflow_cards'

// Simulação de delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const getStoredCards = () => {
  try {
    const raw = localStorage.getItem(CARDS_KEY)
    const cards = raw ? JSON.parse(raw) : []
    // Filter out corrupted cards (missing id)
    return cards.filter(c => c && c.id)
  } catch {
    return []
  }
}

const saveCards = (cards) => {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards))
}

export const cardService = {
  async getCards() {
    await delay(800)
    return getStoredCards()
  },

  async createCard(cardData) {
    await delay(1000)
    
    const cards = getStoredCards()
    
    const newCard = {
      ...cardData,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    
    cards.push(newCard)
    saveCards(cards)
    
    console.log('Cartão criado:', newCard)
    return { success: true, card: newCard, message: 'Cartão cadastrado com sucesso!' }
  },

  async updateCard(cardData) {
    await delay(1000)
    
    if (!cardData.id) {
      throw new Error('ID do cartão é obrigatório para atualização.')
    }

    const cards = getStoredCards()
    const index = cards.findIndex(c => c.id === cardData.id)
    
    if (index === -1) {
      throw new Error('Cartão não encontrado.')
    }
    
    cards[index] = { ...cards[index], ...cardData }
    saveCards(cards)
    
    return { success: true, card: cards[index], message: 'Cartão atualizado com sucesso!' }
  },

  async deleteCard(id) {
    await delay(800)
    
    if (!id) {
      throw new Error('ID do cartão inválido.')
    }

    const cards = getStoredCards()
    const filteredCards = cards.filter(c => c.id !== id)
    
    if (cards.length === filteredCards.length) {
      throw new Error('Cartão não encontrado.')
    }
    
    saveCards(filteredCards)
    
    return { success: true, message: 'Cartão removido com sucesso.' }
  }
}
