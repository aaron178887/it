<script setup>


const props = defineProps({
  about: {
    type: Object,
    required: true, // { title, paragraphs: string[], image, imageAlt }
  }
})
</script>

<template>
  <section id="about" class="about-us">
    <div class="container">
      <div class="row align-items-center g-4">

        <div class="col-12 col-lg-6">
          <h2 class="section-title">{{ about.title || 'O nás' }}</h2>

          <!-- Bez v-html, bezpečně -->
          <p
            v-for="(p, i) in about.paragraphs"
            :key="i"
            class="section-desc preline"
          >{{ p }}</p>
        </div>

        <div class="col-12 col-lg-6" v-if="about.image">
          <figure class="m-0 about-us__media">
            <img
              :src="about.image"
              :alt="about.imageAlt || about.title || 'O nás'"
              class="w-100 h-auto about-us__img"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.preline { white-space: pre-line; }
.about-us__img { aspect-ratio: 4 / 3; }
</style>
