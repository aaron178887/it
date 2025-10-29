<!-- resources/js/Pages/Home.vue -->
<script setup>
import { Head } from '@inertiajs/vue3'

import Header from '@/Ui/Header.vue'
import Footer from '@/Ui/Footer.vue'
import Cta from '@/Ui/Cta.vue'

import HeroSection from '@/Pages/Home/Components/Hero.vue'
import CompaniesSection from '@/Pages/Home/Components/Companies.vue'
import AboutSection from '@/Pages/Home/Components/About.vue'
import ServicesSection from '@/Pages/Home/Components/Services.vue'
import WhySection from '@/Pages/Home/Components/Why.vue'
import DrivesSection from '@/Pages/Home/Components/Drives.vue'

</script>

<template>
  <Head title="IT Globe" />
  <Header />

  <HeroSection />
  <CompaniesSection />
  <AboutSection />

  <ServicesSection />
  <WhySection />
  <DrivesSection />
  <Cta />

  <Footer/>

  <slot />
</template>
