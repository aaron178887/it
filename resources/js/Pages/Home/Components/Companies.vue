<!-- Companies (refs) sekce -->
<script setup>
/* no props */
</script>

<template>
  <section class="text-center pt-5 refs">
    <div class="container">
      <h2 class="fw-bold mb-5">Dodáváme řešení pro přední společnosti</h2>

      <ul class="d-flex gap-5 flex-wrap justify-content-center list-unstyled m-0">
        <li>
          <img
            class="grayed-out"
            :src="'/images/home/client-logo1.svg'"
            alt="Client Logo 1"
            height="30"
            loading="lazy"
          />
        </li>
        <li>
          <img
            class="grayed-out"
            :src="'/images/home/client-logo3.png'"
            alt="Client Logo 3"
            height="30"
            loading="lazy"
          />
        </li>
        <li>
          <img
            class="grayed-out"
            :src="'/images/home/client-logo4.svg'"
            alt="Client Logo 4"
            height="30"
            loading="lazy"
          />
        </li>
        <li>
          <img
            class="grayed-out"
            :src="'/images/home/client-logo5.svg'"
            alt="Client Logo 5"
            height="30"
            loading="lazy"
          />
        </li>
      </ul>
    </div>
  </section>
</template>
<style scoped>
@media (max-width: 576px) {
  .refs > .container > h2 {
    margin-bottom: 2.55rem !important;
  }

  .d-flex.gap-5.flex-wrap.justify-content-center.list-unstyled.m-0
  {
    gap: 2rem !important;
  }
}
</style>
