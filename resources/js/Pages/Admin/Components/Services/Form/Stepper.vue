<!-- resources/js/Pages/Admin/Components/Services/Form/Stepper.vue -->

<script setup>
defineProps({ step: { type:Number, default:1 } })
</script>

<template>
  <div class="stepper">
    <div :class="['step', step===1?'active':(step>1?'done':'')]"><span class="num">1</span><span>Základní údaje</span></div>
    <div class="sep"></div>
    <div :class="['step', step===2?'active':(step>2?'done':'')]"><span class="num">2</span><span>Hero</span></div>
    <div class="sep"></div>
    <div :class="['step', step===3?'active':(step>3?'done':'')]"><span class="num">3</span><span>Sekce</span></div>
    <div class="sep"></div>
    <div :class="['step', step===4?'active':'']"><span class="num">4</span><span>Výhody</span></div>
  </div>
</template>

<style scoped lang="scss">
.stepper{ display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.step{ display:flex; align-items:center; gap:8px; color:#6b7280; font-weight:800; }
.step .num{ width:26px; height:26px; border-radius:50%; display:grid; place-items:center; border:1px solid #e9eaeb; background:#f8fafc; }
.step.active{ color:#111827; }
.step.active .num{ background: color-mix(in srgb, var(--Accent) 10%, #fff); border-color: color-mix(in srgb, var(--Accent) 30%, transparent); }
.step.done{ color:#16a34a; }
.step.done .num{ background: color-mix(in srgb, #16a34a 16%, #fff); border-color: color-mix(in srgb, #16a34a 40%, transparent); }
.sep{ flex:1; height:1px; background:#eceff1; }
</style>
