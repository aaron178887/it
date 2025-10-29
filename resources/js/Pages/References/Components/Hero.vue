<!-- resources/js/Pages/Components/ReferencesHero.vue -->
<script setup>
</script>

<template>
  <section class="references-hero">
    <div class="overlay">
      <div class="container text-center text-white">
        <h1 class="display-4 fw-bold mb-3">Naše reference</h1>
        <p class="fs-5 m-auto">
          Podívejte se, jak pomáháme firmám růst díky spolehlivé infrastruktuře. <br />
          Cloud, spravované servery a kontejnery – vše na míru a bez starostí.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.references-hero {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 200px 8px 140px;
  text-align: center;
  background:
    linear-gradient(0deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.70) 100%),
    url("/images/references/hero.jpg") center bottom / cover no-repeat;
}

.references-hero > .overlay {
  background: none !important;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.references-hero p.fs-5.m-auto {
  max-width: 820px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

@media (max-width: 992px) {
  .references-hero {
    padding: 160px 8px 100px;
  }
}

@media (max-width: 576px) {
  .references-hero {
    height: 486px;
    min-height: 486px;
    padding: 80px 16px 64px;
    gap: 40px;

    background:
      linear-gradient(0deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.70) 100%),
      url("/images/references/hero.jpg") 50% / cover no-repeat;
  }

  .references-hero .container {
    padding-left: 12px;
    padding-right: 12px;
    display: grid;
    justify-items: center;
    row-gap: clamp(16px, 2.2vw, 28px);
    text-align: center;
  }

  .references-hero h1 {
    font-family: 'Sora', sans-serif;
    font-weight: 800;
    font-size: clamp(2rem, 5vw, 2.5rem); 
    line-height: 1.2;
    margin: 0 !important;
  }

  .references-hero p {
    font-size: 1rem; 
    line-height: 1.6;
    opacity: .96;
    margin: 0 !important;
    max-width: 34ch; 
  }
}
</style>
