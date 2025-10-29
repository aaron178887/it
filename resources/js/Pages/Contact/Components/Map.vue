<script setup>
// OPRAVA: Přijímáme map přímo jako prop
const props = defineProps({
  map: { type: Object, required: true }
})
</script>

<template>
  <section class="contact-map" aria-label="Mapa">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <!-- Embed mapy z DB -->
          <iframe
            v-if="map.embed"
            :src="map.embed"
            class="w-100 border-0 rounded-3"
            height="450"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            aria-label="Mapa s naší polohou"
          ></iframe>

          <!-- Fallback: odkaz na mapy -->
          <div v-else class="bg-light rounded-3 p-5 text-center">
            <p class="mb-3">Mapa není k dispozici</p>
            <a
              v-if="map.link"
              :href="map.link"
              target="_blank"
              rel="noopener"
              class="btn btn-primary"
            >
              Otevřít mapu
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-map {
  padding: 56px 16px;
}
@media (max-width: 576px) {
  .contact-map {
    padding: 40px 12px;
  }
}
</style>