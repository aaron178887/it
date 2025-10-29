<script setup>
import { ref, watch } from 'vue'
import { useForm, usePage } from '@inertiajs/vue3'


const showSuccess = ref(false)
const showError = ref(false)
const errorText = ref('')
const captchaInput = ref(null)

const form = useForm({
  name: '',
  email: '',
  message: '',
  captcha: '',
  captcha_qid: '',
  captcha_sig: '',
})


const page = usePage()
const currentQ = ref(page.props?.captcha ?? { id: '', text: '', sig: '' })

if (currentQ.value?.id) {
  form.captcha_qid = currentQ.value.id
  form.captcha_sig = currentQ.value.sig || ''
}


watch(
  () => page.props?.captcha,
  (newCaptcha) => {
    if (newCaptcha?.id) {
      currentQ.value = newCaptcha
      form.captcha_qid = newCaptcha.id
      form.captcha_sig = newCaptcha.sig || ''
      form.captcha = ''
    } else {
      currentQ.value = { id: '', text: '', sig: '' }
      form.captcha_qid = ''
      form.captcha_sig = ''
      form.captcha = ''
    }
  },
  { immediate: true }
)

/* Toast helpers */
function flashSuccess() {
  showError.value = false
  showSuccess.value = true
  setTimeout(() => (showSuccess.value = false), 3500)
}
function flashError(message = 'Odeslání se nezdařilo. Zkuste to prosím znovu.') {
  errorText.value = message
  showSuccess.value = false
  showError.value = true
  setTimeout(() => (showError.value = false), 4000)
}

/* Pick first useful error from server */
function firstError(errors) {
  return (
    errors?.form ||
    errors?.captcha ||
    errors?.email ||
    errors?.name ||
    errors?.message ||
    'Formulář obsahuje chyby.'
  )
}

/* Submit – vše validuje backend */
function submit() {
  showSuccess.value = false
  showError.value = false
  errorText.value = ''

  form.post('/kontakt', {
    preserveScroll: true,
    onSuccess: () => {
      flashSuccess()
      form.clearErrors()
      form.reset('name','email','message','captcha')
      setTimeout(() => captchaInput.value?.focus({ preventScroll: true }), 50)
    },
    onError: (errors) => {
      flashError(firstError(errors))
      if (errors?.captcha) {
        setTimeout(() => captchaInput.value?.focus({ preventScroll: true }), 50)
      }
    },
  })
}
</script>

<template>
  <div>
    <!-- Toasty -->
    <div class="notify-wrap" aria-live="polite" aria-atomic="true">
      <div v-if="showSuccess" class="toast-notice" role="status">
        <strong>Hotovo</strong>
        <div>Děkujeme! Vaše zpráva byla úspěšně odeslána.</div>
      </div>
      <div v-if="showError" class="toast-error" role="alert" aria-live="assertive">
        <strong>Chyba</strong>
        <div>{{ errorText }}</div>
      </div>
    </div>

    <form id="contact-form"
          class="bg-white h-100 p-4 d-flex flex-column gap-3 rounded-3"
          novalidate
          @submit.prevent="submit"
    >
      <div>
        <label for="contact-name" class="fw-bold mb-2">Jméno</label>
        <input id="contact-name" name="name" type="text"
               class="form-control bg-secondary py-2 px-3 w-100"
               :class="{ 'is-invalid': !!form.errors.name }"
               placeholder="Jan Novák" required autocomplete="name"
               v-model="form.name" />
        <div v-if="form.errors.name" class="invalid-feedback d-block">{{ form.errors.name }}</div>
      </div>

      <div>
        <label for="contact-email" class="fw-bold mb-2">E-mailová adresa</label>
        <input id="contact-email" name="email" type="email"
               class="form-control bg-secondary py-2 px-3 w-100"
               :class="{ 'is-invalid': !!form.errors.email }"
               placeholder="uzivatel@domena.cz" required autocomplete="email"
               v-model="form.email" />
        <div v-if="form.errors.email" class="invalid-feedback d-block">{{ form.errors.email }}</div>
      </div>

      <div>
        <label for="contact-message" class="fw-bold mb-2">Zpráva</label>
        <textarea id="contact-message" name="message"
                  class="form-control bg-secondary py-2 px-3 w-100"
                  :class="{ 'is-invalid': !!form.errors.message }"
                  placeholder="Zadejte svou zprávu…" rows="7" required
                  v-model="form.message"></textarea>
        <div v-if="form.errors.message" class="invalid-feedback d-block">{{ form.errors.message }}</div>
      </div>

      <!-- Captcha (Enter odesílá formulář přes @submit na <form>) -->
      <div>
        <label for="contact-captcha" class="fw-bold mb-2">
          Kontrolní otázka: {{ currentQ.text || 'Načítám…' }}
        </label>

        <input ref="captchaInput"
               id="contact-captcha"
               name="captcha"
               type="text"
               class="form-control bg-secondary py-2 px-3 w-100"
               :class="{ 'is-invalid': !!form.errors.captcha }"
               :placeholder="currentQ.text ? 'Zapište výsledek číslem' : 'Načítám…'"
               :disabled="!currentQ.id"
               required
               inputmode="numeric"
               v-model="form.captcha" />

        <!-- skryté hodnoty pro backend -->
        <input type="hidden" name="captcha_qid" :value="form.captcha_qid" />
        <input type="hidden" name="captcha_sig" :value="form.captcha_sig" />

        <div v-if="form.errors.captcha" class="invalid-feedback d-block">{{ form.errors.captcha }}</div>
        <div v-if="form.errors.form && !form.errors.captcha" class="invalid-feedback d-block">{{ form.errors.form }}</div>
      </div>

      <button type="submit"
              class="mt-auto btn btn-primary rounded-3 py-3"
              :disabled="form.processing || !currentQ.id">
        <span v-if="form.processing">Odesílám…</span>
        <span v-else>Odeslat zprávu</span>
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.notify-wrap {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1060;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast-notice,
.toast-error {
  min-width: 280px;
  max-width: 420px;
  border-radius: .5rem;
  padding: .75rem 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,.12);
  animation: toastIn .25s ease-out, toastOut .5s ease-in 3.2s forwards;
  pointer-events: auto;
}

.toast-notice {
  background: #d1e7dd;
  color: #0f5132;
  border: 1px solid #badbcc;
}
.toast-error {
  background: #f8d7da;
  color: #842029;
  border: 1px solid #f5c2c7;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes toastOut {
  to   { opacity: 0; transform: translateY(-6px); }
}
</style>
