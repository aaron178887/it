<!-- resources/js/Pages/References.vue -->
<script setup>
import { Head } from '@inertiajs/vue3'

import Header from '@/Ui/Header.vue'
import Footer from '@/Ui/Footer.vue'
import Cta from '@/Ui/Cta.vue'

import ReferencesHero from '@/Pages/References/Components/Hero.vue'
import Partners       from '@/Pages/References/Components/Partners.vue'

const { references } = defineProps({
  references: { type: Array, default: () => [] },
})

import '~/css/references.scss'
</script>

<template>
  <Head title="Reference | IT Globe s.r.o." />

  <Header /> 
  <main class="page-references">
    <ReferencesHero /> 
    <Partners :items="references" />
    <Cta />
  </main>
  <Footer />
</template>

<style scoped> 
@media (max-width: 576px) {
  :deep(.site-footer > .container) {
    display: block !important;
    gap: 0 !important;
    align-items: normal !important;
    text-align: initial !important;
  }
}
</style>
