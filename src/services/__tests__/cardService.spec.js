import { describe, it, expect, beforeEach, vi } from 'vitest'
import { cardService } from '../cardService'

describe('cardService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('deve criar um novo cartão', async () => {
    const cardData = {
      name: 'Nubank',
      network: 'mastercard',
      type: 'credit',
      color: '#820ad1'
    }

    const response = await cardService.createCard(cardData)
    
    expect(response.success).toBe(true)
    expect(response.card.id).toBeDefined()
    expect(response.card.name).toBe('Nubank')
    
    const cards = await cardService.getCards()
    expect(cards).toHaveLength(1)
  })

  it('deve listar cartões', async () => {
    await cardService.createCard({ name: 'C1' })
    await cardService.createCard({ name: 'C2' })
    
    const cards = await cardService.getCards()
    expect(cards).toHaveLength(2)
  })

  it('deve atualizar um cartão', async () => {
    const { card } = await cardService.createCard({ name: 'Original' })
    
    const response = await cardService.updateCard({ 
      id: card.id, 
      name: 'Atualizado' 
    })
    
    expect(response.success).toBe(true)
    expect(response.card.name).toBe('Atualizado')
    
    const cards = await cardService.getCards()
    expect(cards[0].name).toBe('Atualizado')
  })

  it('deve remover um cartão', async () => {
    const { card } = await cardService.createCard({ name: 'To Delete' })
    
    const response = await cardService.deleteCard(card.id)
    expect(response.success).toBe(true)
    
    const cards = await cardService.getCards()
    expect(cards).toHaveLength(0)
  })

  it('deve lançar erro ao atualizar cartão inexistente', async () => {
    await expect(cardService.updateCard({ id: 'invalid', name: 'Test' }))
      .rejects.toThrow('Cartão não encontrado.')
  })
})
