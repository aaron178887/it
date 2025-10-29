<script setup>
import { computed } from 'vue'
import { Head } from '@inertiajs/vue3'

import Header from '@/Ui/Header.vue'
import Footer from '@/Ui/Footer.vue'
import Cta from '@/Ui/Cta.vue'

import AboutHero from '@/Pages/About/Components/Hero.vue'
import AboutUs from '@/Pages/About/Components/AboutUs.vue'
import Infrastructure from '@/Pages/About/Components/Infrastructure.vue'
import OurTeam from '@/Pages/About/Components/OurTeam.vue'

import '~/css/about.scss'



const props = defineProps({
  page: { type: Object, required: true }
})

// === FLAT data z backendu ===
const pageData = computed(() => props.page?.data || {})
const hero     = computed(() => pageData.value.hero || {})
const counters = computed(() => hero.value?.counters || [])

/* Rozsekání textu z DB na odstavce (bez HTML) */
function splitParas (t = '') {
  return (t || '')
    .split(/\r?\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
}

const about = computed(() => {
  const a   = pageData.value.about || {}
  const img = a.image || {}
  return {
    title: a.title ?? 'O nás',
    paragraphs: splitParas(a.text || ''),
    image: img.src ?? '',
    imageAlt: img.alt ?? ''
  }
})

const infrastructure = computed(() => ({
  lead: pageData.value.infrastructure?.lead ?? '',
  blocks: pageData.value.infrastructure?.blocks ?? []
}))

const gallery = computed(() => pageData.value.gallery ?? [])
</script>


<template>
  <Head :title="(hero.title ? hero.title + ' | ' : '') + 'O nás | IT Globe s.r.o.'" />
  <Header />
  <main>
    <AboutHero :hero="hero" :counters="counters" />
    <AboutUs :about="about" />
    <Infrastructure :infrastructure="infrastructure" />
    <OurTeam :gallery="gallery" />
    <Cta />
  </main>
  <Footer />
</template>
