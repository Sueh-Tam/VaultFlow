<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2 v-if="title">{{ title }}</h2>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
})
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* Adjust based on header height */
  padding: 2rem;
  background-color: var(--color-background-soft);
}

.auth-card {
  background: var(--color-background);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 480px;
  border: 1px solid var(--color-border);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  color: var(--color-heading);
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text);
  font-size: 0.95rem;
}
</style>
