<!-- resources/js/Pages/Components/About/OurTeam.vue -->
<script setup>
const props = defineProps({
  gallery: {
    type: Array,
    default: () => [] // [{ title, alt, src }]
  }
})

// Vezmi jen reálné položky s vyplněným src + doplň alt/title z DB
const imgs = (props.gallery || [])
  .filter(g => g && typeof g.src === 'string' && g.src.trim() !== '')
  .map(g => ({
    src: g.src.trim(),
    alt: (g.alt || g.title || '').trim(),
    title: (g.title || '').trim()
  }))
</script>

<template>
  <section class="d-none d-md-block text-center our-team">
    <div class="container">
      <div class="row g-3 align-items-stretch">
        <!-- Levý velký obrázek (jen pokud existuje v DB) -->
        <div class="col-md-4 pb-0" v-if="imgs[0]">
          <div class="rounded-3 overflow-hidden h-100 our-team__left">
            <img
              :src="imgs[0].src"
              :alt="imgs[0].alt || ''"
              :title="imgs[0].title || ''"
              class="w-100 h-100 object-fit-cover"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Pravý grid 2×2 -->
        <div class="col">
          <div class="row g-3 row-cols-1 row-cols-sm-2 align-items-stretch our-team__grid">
            <!-- Červená dlaždice (smajlík NEMĚNÍM) -->
            <div class="col">
              <div class="bg-primary p-5 d-flex justify-content-center align-items-center rounded-3 overflow-hidden our-team__tile">
                <div>
                  <div class="emoji" role="img" aria-label="Usměvavá tvář">
                    <span class="emoji__mouth"></span>
                  </div>
                  <p class="fw-bold fs-2 text-white mb-0">
                    Odhodlaný<br> tým profesionálů
                  </p>
                </div>
              </div>
            </div>

            <!-- Obrázky 1–3 z DB (bez dummy), pozice odpovídá původním indexům 1..3 -->
            <template v-for="i in [1,2,3]" :key="i">
              <div class="col" v-if="imgs[i]">
                <div class="rounded-3 overflow-hidden our-team__tile">
                  <img
                    :src="imgs[i].src"
                    :alt="imgs[i].alt || ''"
                    :title="imgs[i].title || ''"
                    class="w-100 h-100 object-fit-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
        <!-- /Pravý grid -->
      </div>
    </div>
  </section>
</template>

<style scoped>
/* barva dlaždice = akcent */
.our-team .bg-primary { background-color:#F52130 !important; }

/* vyrovnání výšek bez zásahu do HTML */
.our-team__tile,
.our-team__left { height: 100%; }

/* jistota chování obrázků i po výměně assetů */
.our-team__tile img,
.our-team__left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
