<script setup>
import { Head, useForm } from '@inertiajs/vue3'

import Header from '@/Ui/Header.vue'
import Footer from '@/Ui/Footer.vue'

const form = useForm({
  email: '',
  password: '',
})

const submit = () => {
  form.post('/login', {
    preserveScroll: true,
    replace: true,      
    onError: () => {
      form.reset('password')
    },
  })
}
</script>

<template>
  <Head title="Přihlášení" />
  <Header />

  <main class="login-page">
    <div class="container d-flex justify-content-center align-items-start login-container">
      <div class="card shadow-sm border-0 login-card">
        <div class="card-body p-4 p-md-5">
          <h1 class="h3 fw-bold mb-3 font-sora">Přihlášení</h1>
          <p class="text-muted mb-4">Zadejte své přihlašovací údaje.</p>

          <div v-if="$page.props.flash?.error" class="alert alert-danger" role="alert">
            {{ $page.props.flash.error }}
          </div>

          <form @submit.prevent="submit" novalidate>
            <div class="mb-3">
              <label for="email" class="form-label fw-semibold">E-mail</label>
              <input
                id="email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': form.errors.email }"
                v-model.trim="form.email"
                autocomplete="username"
                required
              />
              <div class="invalid-feedback" v-if="form.errors.email">
                {{ form.errors.email }}
              </div>
            </div>

            <div class="mb-4">
              <label for="password" class="form-label fw-semibold">Heslo</label>
              <input
                id="password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': form.errors.password }"
                v-model="form.password"
                autocomplete="current-password"
                required
              />
              <div class="invalid-feedback" v-if="form.errors.password">
                {{ form.errors.password }}
              </div>
            </div>

            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg" :disabled="form.processing">
                <i class="fa-solid fa-right-to-bracket me-2" aria-hidden="true"></i>
                {{ form.processing ? 'Přihlašuji…' : 'Přihlásit se' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</template>

<style scoped>
.login-page {
  padding-top: 180px;
  padding-bottom: 80px;
  min-height: calc(100vh - 80px);
  background: var(--bs-light);
}
.login-container { flex: 1; }
.login-card { width: 100%; max-width: 520px; border-radius: 12px; }

@media (max-width: 992px) {
  .login-page { padding-top: 140px; padding-bottom: 60px; }
}
@media (max-width: 576px) {
  .login-page { padding-top: 120px; padding-bottom: 40px; }
}
</style>
