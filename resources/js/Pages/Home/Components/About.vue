<!-- About sekce -->
<script setup>
</script>

<template>
  <section class="about">
    <div class="container bg-white p-4 p-md-5 rounded-3">
      <div class="d-flex flex-column flex-lg-row gap-5 justify-content-between align-items-center">
        <div class="col d-flex flex-column">
          <p class="about-subtitle">IT&nbsp;Globe</p>
          <h2 class="about-title">Komplexní hostingové služby</h2>

          <p class="about-paragraph">
            IT Globe s.r.o. je moderní technologická společnost zaměřená na poskytování spolehlivých a efektivních IT řešení pro firmy všech velikostí.
            Naším cílem je pomáhat klientům růst prostřednictvím inovací, automatizace a chytrého využití technologií.
          </p>
        </div>

        <div class="col d-flex flex-column gap-3">
          <img
            :src="'/images/home/about.jpg'"
            alt="IT Globe – tým a infrastruktura"
            class="img-fluid rounded-3 object-fit-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped> 
</style>