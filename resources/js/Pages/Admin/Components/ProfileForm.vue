<!-- resources/js/Pages/Admin/Components/ProfileForm.vue -->
<script setup>
import { useForm, usePage } from '@inertiajs/vue3'
import { computed, watchEffect } from 'vue'

const page = usePage()
const me = computed(() => page.props.auth?.user || {})

const form = useForm({
  name:  me.value?.name ?? '',
  email: me.value?.email ?? '',
  new_password: '',
  new_password_confirmation: '',
})

watchEffect(() => {
  if (me.value?.name)  form.name  = me.value.name
  if (me.value?.email) form.email = me.value.email
})

function submit () {
  form.put(route('admin.profile.update'), { preserveScroll: true })
}
</script>

<template>
  <form @submit.prevent="submit" class="profile-form">
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Jméno</label>
        <input v-model="form.name" type="text" class="form-control" :class="{'is-invalid': form.errors.name}">
        <div class="invalid-feedback" v-if="form.errors.name">{{ form.errors.name }}</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">E-mail</label>
        <input v-model="form.email" type="email" class="form-control" :class="{'is-invalid': form.errors.email}">
        <div class="invalid-feedback" v-if="form.errors.email">{{ form.errors.email }}</div>
      </div>
    </div>

    <hr class="my-3" />

    <p class="text-muted mb-2">Změna hesla (volitelné)</p>
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Nové heslo</label>
        <input
          v-model="form.new_password"
          type="password"
          autocomplete="new-password"
          class="form-control"
          :class="{'is-invalid': form.errors.new_password}"
        >
        <div class="invalid-feedback" v-if="form.errors.new_password">
          {{ form.errors.new_password }}
        </div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Potvrzení nového hesla</label>
        <input
          v-model="form.new_password_confirmation"
          type="password"
          autocomplete="new-password"
          class="form-control"
          :class="{'is-invalid': form.errors.new_password_confirmation}"
        >
        <div class="invalid-feedback" v-if="form.errors.new_password_confirmation">
          {{ form.errors.new_password_confirmation }}
        </div>
      </div>
    </div>

    <!-- tlačítko doprava -->
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-primary" :disabled="form.processing">
        <i class="fa-solid fa-floppy-disk me-1"></i> Uložit změny
      </button>
    </div>
  </form>
</template>

<style scoped>
.profile-form .form-label{ font-weight:700; }
.profile-form .is-invalid{ border-color:#dc3545; }
</style>
