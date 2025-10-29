<script setup>
import { computed } from 'vue'
import { Head } from '@inertiajs/vue3'
import Header from '@/Ui/Header.vue'
import Footer from '@/Ui/Footer.vue'
import Cta from '@/Ui/Cta.vue'

import ContactHero    from '@/Pages/Contact/Components/Hero.vue'
import ContactContent from '@/Pages/Contact/Components/Content.vue'
import ContactMap     from '@/Pages/Contact/Components/Map.vue'

import '~/css/contact.scss'

const props = defineProps({
  page: { type: Object, required: true },
  captcha: { type: Object, required: true }
})

const pageData = computed(() => props.page?.data || {})
const hero = computed(() => pageData.value?.hero || {})
const company = computed(() => pageData.value?.company || {})
const contacts = computed(() => pageData.value?.contacts || {})
const map = computed(() => pageData.value?.map || {})
</script>

<template>
  <Head :title="`${hero.title || 'Kontakt'} | IT Globe s.r.o.`" />

  <Header />

  <main>
    <ContactHero :hero="hero" />
    <ContactContent :company="company" :contacts="contacts" />
    <ContactMap :map="map" />
    <Cta />
  </main>

  <Footer />
</template>

<style scoped>
:deep(#contact-form) {
  scroll-margin-top: 84px;
}
</style>