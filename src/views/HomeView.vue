<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>Organize suas finanças com segurança</h1>
        <p>
          O VaultFlow é a solução completa para gerenciar suas contas, cartões e parcelamentos.
          Tenha controle total sobre seus gastos e planeje seu futuro financeiro com tranquilidade.
        </p>
        <div class="actions">
          <router-link to="/register" class="btn-primary">Começar Agora</router-link>
          <router-link to="/login" class="btn-secondary">Login</router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <h3>Controle de Cartões</h3>
        <p>Gerencie múltiplos cartões de crédito e débito em um só lugar, com visualização clara dos limites e faturas.</p>
      </div>
      <div class="feature-card">
        <h3>Gestão de Parcelas</h3>
        <p>Acompanhe suas compras parceladas e saiba exatamente quanto vai pagar nos próximos meses.</p>
      </div>
      <div class="feature-card">
        <h3>Segurança Total</h3>
        <p>Seus dados financeiros protegidos com a mais alta tecnologia e privacidade garantida.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 6rem 1rem;
  background: var(--color-background-soft);
  border-radius: 16px;
  margin-bottom: 4rem;
  border: 1px solid var(--color-border);
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  line-height: 1.1;
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  color: var(--color-text);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 189, 126, 0.3);
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid var(--color-border);
  color: var(--color-heading);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-color: var(--color-primary);
}

.feature-card h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.feature-card p {
  color: var(--color-text);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero {
    padding: 4rem 1rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>
