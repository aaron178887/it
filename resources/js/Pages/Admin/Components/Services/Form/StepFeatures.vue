<!-- resources/js/Pages/Admin/Components/Services/Form/StepFeatures.vue -->
<script setup>
import FeaturesEditor from '@/Pages/Admin/Components/Services/FeaturesEditor.vue'

const items   = defineModel('items',   { type:Array, default:()=>[] })
const heading = defineModel('heading', { type:String, default:'Výhody' })
const props = defineProps({ savingLabel:{ type:String, default:'Uložit' } })
const emit  = defineEmits(['prev','save'])
</script>

<template>
  <div class="form-grid full">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <h3 class="mb-0 h6 fw-extrabold">Tabulka výhod</h3>
    </div>

    <div class="mb-3">
      <label class="form-label">Nadpis sekce výhod</label>
      <input v-model="heading" class="form-control" placeholder="Výhody" />
    </div>

    <FeaturesEditor v-model="items" />

    <div class="actions">
      <button class="btn btn-light border" @click="$emit('prev')">Zpět</button>
      <button class="btn btn-primary" @click="$emit('save')">{{ props.savingLabel }}</button>
    </div>
  </div>
</template>

<style scoped>
.actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:8px }
.fw-extrabold{ font-weight:800 }
</style>
