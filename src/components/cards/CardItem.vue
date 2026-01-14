<template>
  <div 
    class="credit-card" 
    :style="{ '--card-color': card.color || '#333' }"
    @click="$emit('edit', card)"
  >
    <div class="card-header">
      <span class="card-type">{{ card.type === 'credit' ? 'Crédito' : 'Débito' }}</span>
      <span class="card-network">{{ card.network }}</span>
    </div>
    
    <div class="card-body">
      <div class="card-chip"></div>
      <div class="card-number">
        •••• •••• •••• {{ card.last4Digits || '0000' }}
      </div>
    </div>
    
    <div class="card-footer">
      <div class="card-holder">
        <span class="label">Titular</span>
        <span class="value">{{ card.name }}</span>
      </div>
    </div>

    <div class="card-actions" @click.stop>
      <button class="btn-icon edit" @click="$emit('edit', card)" title="Editar">✎</button>
      <button class="btn-icon delete" @click="$emit('delete', card.id)" title="Excluir">🗑</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  card: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])
</script>

<style scoped>
.credit-card {
  width: 100%;
  max-width: 340px;
  height: 200px;
  background: linear-gradient(135deg, var(--card-color), #000);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  overflow: hidden;
}

.credit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-type {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 2px 8px;
  border-radius: 12px;
}

.card-network {
  font-weight: 800;
  font-style: italic;
  font-size: 1.2rem;
  text-transform: uppercase;
}

.card-body {
  margin-top: 1rem;
}

.card-chip {
  width: 40px;
  height: 30px;
  background: linear-gradient(135deg, #e0e0e0, #a0a0a0);
  border-radius: 6px;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

.card-chip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0,0,0,0.2);
}

.card-number {
  font-size: 1.4rem;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
  text-shadow: 0 2px 2px rgba(0,0,0,0.3);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-holder {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.6rem;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 2px;
}

.value {
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
}

.card-actions {
  position: absolute;
  top: 1rem;
  right: -50px; /* Hidden initially */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: right 0.3s ease;
}

.credit-card:hover .card-actions {
  right: 1rem;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.4);
}

.btn-icon.delete:hover {
  background: #ff4d4f;
}
</style>
