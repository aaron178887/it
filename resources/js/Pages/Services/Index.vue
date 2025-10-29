<script setup>
import { computed } from 'vue'
import { Head } from '@inertiajs/vue3'

import Header from '@/Ui/Header.vue'
import Footer from '@/Ui/Footer.vue'
import Cta from '@/Ui/Cta.vue'

import ServicesHero      from '@/Pages/Services/Components/Hero.vue'
import ServicesTextSplit from '@/Pages/Services/Components/TextSplit.vue'
import ServicesFeatures  from '@/Pages/Services/Components/Features.vue'
import WhyChoose         from '@/Pages/Services/Components/WhyChoose.vue'

import '~/css/services.scss'

const props = defineProps({
  service: { type: Object, required: true }
})

const heroData = computed(() => {
  const h = props.service?.hero || {}
  return {
    title:    h.title    ?? props.service?.title ?? '',
    lead:     h.lead     ?? '',
    image:    h.image    ?? null,
    ctaLabel: h.ctaLabel ?? 'Zjistit více',
    ctaHref:  h.ctaHref  ?? '#learn',
  }
})

const blocks = computed(() => Array.isArray(props.service?.sections) ? props.service.sections : [])
const rows = computed(() => Array.isArray(props.service?.rows) ? props.service.rows : [])
const hasFeatures = computed(() =>
  Array.isArray(props.service?.features?.items) && props.service.features.items.length > 0
)
</script>

<template>
  <Head :title="`${service?.title || 'Služby'} | IT Globe s.r.o.`" />

  <Header />

  <main>
    <ServicesHero :hero="heroData" />

    <ServicesTextSplit :rows="rows" />

    <ServicesFeatures
      v-if="hasFeatures"
      :heading="service.features.heading ?? 'Benefity'"
      :items="service.features.items"
    />

    <WhyChoose />
    <Cta />
  </main>

  <Footer />
</template>
