<!-- resources/js/Pages/Services/Components/TextSplit.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows:   { type: Array,  default: () => [] },  // preferovaný vstup (server ho může posílat)
  blocks: { type: Array,  default: () => [] },  // fallback když rows chybí
  block:  { type: Object, default: null },      // nevyužito, zachovávám API
})

/* ===== helpers ===== */
const toSrcsetStr = (srcset) => {
  if (!srcset) return null
  if (Array.isArray(srcset)) return srcset.join(', ')
  if (typeof srcset === 'object') {
    return Object.entries(srcset)
      .map(([w, url]) => `${url} ${w}w`)
      .join(', ')
  }
  if (typeof srcset === 'string') return srcset
  return null
}

const normalizeImage = (img = {}, title = '') => {
  const src       = img?.src || null
  const srcset    = img?.srcset || null
  const srcsetStr = img?.srcsetStr || toSrcsetStr(srcset)
  const alt       = img?.alt || title || 'Ilustrace'
  return src ? { src, srcset, srcsetStr, alt } : null
}

const plainLenFromBlock = (b = {}) => {
  if ((b.type || '') !== 'p') {
    const html = String(b.html || '')
    return html ? (html.replace(/<[^>]+>/g, '')).length : 0
  }
  if ('text' in b) return String(b.text || '').length
  if ('html' in b) return String(b.html || '').replace(/<[^>]+>/g, '').length
  return 0
}

const isLongText = (paragraphBlocks = []) => {
  const count = paragraphBlocks.length
  let chars = 0
  for (const p of paragraphBlocks) chars += plainLenFromBlock(p)
  return (count >= 4) || (chars >= 600)
}

/* Mini port backendové blocksToRows */
const blocksToRows = (blocks = []) => {
  const out = []
  let splitIndex = 0

  for (const b of blocks) {
    const type  = String(b?.type || 'split').toLowerCase()
    const title = String(b?.title || '')

    if (type === 'features') continue

    if (type === 'columns') {
      const c0 = Array.isArray(b?.columns?.[0]) ? b.columns[0] : []
      const c1 = Array.isArray(b?.columns?.[1]) ? b.columns[1] : []
      out.push({ kind: 'columns', title, columns: [c0, c1] })
      continue
    }

    const content = Array.isArray(b?.content) ? b.content : []
    const image   = 'image' in (b || {}) ? normalizeImage(b.image, title) : null

    if (!image && content.length) {
      out.push({ kind: 'text-only', title, paragraphs: content })
      continue
    }
    if (image && !content.length) {
      out.push({ kind: 'image-only', title, image })
      continue
    }

    const pos = typeof b?.imagePosition === 'string' ? b.imagePosition.toLowerCase() : null
    const imgLeft = pos === 'left' ? true : (pos === 'right' ? false : ((splitIndex % 2) === 1))

    out.push({
      kind: 'split',
      title,
      paragraphs: content,
      image,
      imgLeft,
      matchText: isLongText(content),
    })
    splitIndex++
  }

  return out
}

/* rows s fallbackem na blocks */
const rows = computed(() => {
  const r = Array.isArray(props.rows) ? props.rows : []
  if (r.length) {
    // jen dopočítej srcsetStr bez mutace
    return r.map(row => {
      if (row?.image && !row.image.srcsetStr) {
        return { ...row, image: { ...row.image, srcsetStr: toSrcsetStr(row.image.srcset) } }
      }
      return row
    })
  }
  const b = Array.isArray(props.blocks) ? props.blocks : []
  return blocksToRows(b)
})

function isMuted(i) {
  const last = rows.value.length - 1
  if (i === last) return false
  return i % 2 === 1
}
</script>

<template>
  <template v-for="(row, i) in rows" :key="i">
    <!-- SPLIT -->
    <section v-if="row.kind === 'split'"
             class="services-text services-text--split-clean"
             :class="{'muted-section': isMuted(i), 'match-text': row.matchText}"
             :aria-label="row.title || 'Sekce'">
      <div class="container">
        <div class="grid grid--tight grid--vcenter" :class="{'grid--mirror': row.imgLeft}">
          <figure v-if="row.imgLeft" class="media media--auto">
            <img :src="row.image?.src"
                 :srcset="row.image?.srcsetStr || null"
                 sizes="(max-width: 992px) 100vw, 520px"
                 :alt="row.image?.alt || row.title || 'Ilustrace'"
                 loading="lazy" />
          </figure>

          <article class="col-text col-text--vcenter">
            <h2 v-if="row.title" class="services-text__title">{{ row.title }}</h2>

            <template v-for="(p, pi) in row.paragraphs" :key="pi">
              <h3 v-if="p.type==='h3'" class="services-text__sub" v-html="p.html"></h3>
              <p v-else-if="p.type==='p'" class="services-text__desc" v-html="p.html"></p>
              <div v-else-if="p.type==='ul' || p.type==='ol' || p.type==='raw'" v-html="p.html"></div>
            </template>
          </article>

          <figure v-if="!row.imgLeft" class="media media--auto">
            <img :src="row.image?.src"
                 :srcset="row.image?.srcsetStr || null"
                 sizes="(max-width: 992px) 100vw, 520px"
                 :alt="row.image?.alt || row.title || 'Ilustrace'"
                 loading="lazy" />
          </figure>
        </div>
      </div>
    </section>

    <!-- TEXT ONLY → vycentrované přes celou šířku -->
    <section v-else-if="row.kind === 'text-only'"
             class="services-text services-text--split-clean services-text--centered"
             :class="{'muted-section': isMuted(i)}"
             :aria-label="row.title || 'Textová sekce'">
      <div class="container">
        <div class="grid grid--center">
          <article class="col-text col-text--center">
            <h2 v-if="row.title" class="services-text__title">{{ row.title }}</h2>

            <template v-for="(p, pi) in row.paragraphs" :key="pi">
              <h3 v-if="p.type==='h3'" class="services-text__sub" v-html="p.html"></h3>
              <p v-else-if="p.type==='p'" class="services-text__desc" v-html="p.html"></p>
              <div v-else-if="p.type==='ul' || p.type==='ol' || p.type==='raw'" v-html="p.html"></div>
            </template>
          </article>
        </div>
      </div>
    </section>

    <!-- COLUMNS -->
    <section v-else-if="row.kind === 'columns'"
             class="services-text services-text--split-clean"
             :class="{'muted-section': isMuted(i)}"
             :aria-label="row.title || 'Sekce ve dvou sloupcích'">
      <div class="container">
        <h2 v-if="row.title" class="services-text__title columns-header">{{ row.title }}</h2>

        <div class="grid grid--2col">
          <article class="col-text">
            <template v-for="(p, pi) in (row.columns?.[0] || [])" :key="'c1-' + pi">
              <h3 v-if="p.type==='h3'" class="services-text__sub" v-html="p.html"></h3>
              <p v-else-if="p.type==='p'" class="services-text__desc" v-html="p.html"></p>
              <div v-else-if="p.type==='ul' || p.type==='ol' || p.type==='raw'" v-html="p.html"></div>
            </template>
          </article>

          <article class="col-text">
            <template v-for="(p, pi) in (row.columns?.[1] || [])" :key="'c2-' + pi">
              <h3 v-if="p.type==='h3'" class="services-text__sub" v-html="p.html"></h3>
              <p v-else-if="p.type==='p'" class="services-text__desc" v-html="p.html"></p>
              <div v-else-if="p.type==='ul' || p.type==='ol' || p.type==='raw'" v-html="p.html"></div>
            </template>
          </article>
        </div>
      </div>
    </section>

    <!-- IMAGE ONLY -->
    <section v-else-if="row.kind === 'image-only'"
             class="services-text services-text--split-clean"
             :class="{'muted-section': isMuted(i)}"
             :aria-label="row.title || 'Obrázková sekce'">
      <div class="container">
        <div class="grid image-only">
          <article v-if="row.title" class="col-text image-only__title">
            <h2 class="services-text__title">{{ row.title }}</h2>
          </article>
          <figure class="media media--auto image-only__media">
            <img :src="row.image?.src"
                 :srcset="row.image?.srcsetStr || null"
                 sizes="(max-width: 992px) 100vw, 920px"
                 :alt="row.image?.alt || row.title || 'Ilustrace'"
                 loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  </template>
</template>

<style scoped lang="scss">
.grid--vcenter { align-items: center; }

/* desktop layout */
.services-text.services-text--split-clean .grid.grid--tight {
  --col-gap: clamp(1rem, 2vw, 2rem);
  gap: var(--col-gap) !important;
  display: grid;
  grid-template-columns: 1fr minmax(360px, 520px);
}
.services-text.services-text--split-clean .grid.grid--tight.grid--mirror {
  grid-template-columns: minmax(360px, 520px) 1fr !important;
}

/* media layout defaults */
.services-text.services-text--split-clean .grid.grid--tight > .media { margin-inline: 0; }
.services-text.services-text--split-clean .grid.grid--tight:not(.grid--mirror) > .media:last-child { margin-left: clamp(10px, 1.2vw, 18px); }
.services-text.services-text--split-clean .grid.grid--tight.grid--mirror > .media:first-child { margin-right: clamp(6px, 0.8vw, 12px); }

.media {
  margin: 0;
  align-self: center;
  display: flex;
  justify-content: center;
}
.media--auto {
  aspect-ratio: 16 / 10 !important;
  max-width: clamp(340px, 32vw, 520px);
  max-height: clamp(210px, 28vw, 340px);
}
.media--auto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: .6em;
}

/* equal-height variant */
.services-text.services-text--split-clean.match-text .grid.grid--tight,
.services-text.services-text--split-clean.match-text .grid.grid--tight.grid--mirror { align-items: stretch; }
.services-text.services-text--split-clean.match-text .media { height: 80%; }
.services-text.services-text--split-clean.match-text .media--auto { aspect-ratio: auto !important; max-width: clamp(340px, 32vw, 520px); max-height: none; }
.services-text.services-text--split-clean.match-text .media--auto img { width: 100%; height: 100%; object-fit: cover; border-radius: .6em; }

/* === columns layout === */
.services-text.services-text--split-clean .grid.grid--2col{
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: var(--col-gap, clamp(1rem, 2vw, 2rem));
  align-items: start;
}
.services-text.services-text--split-clean .grid.grid--2col .col-text :deep(.services-text__sub){
  padding-top: 0 !important;
  margin-top: 0 !important;
}

/* image-only centering */
.image-only { place-items: center; text-align: center; }
.image-only__title { grid-column: 1 / -1; }
.image-only__media { grid-column: 1 / -1; }

/* look & type */
.muted-section { background: var(--Base-200); }
.services-text__title{
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(1.6rem, 3vw, 2rem);
  line-height: 1.2;
  color: var(--Black, #000);
  margin: 0 0 .5rem;
}
.services-text__sub{
  margin: 1rem 0 .6rem;
  font-family: 'Sora', sans-serif;
  font-weight: 800;
  font-size: clamp(1.25rem, 2.25vw, 1.6rem);
  line-height: 1.25;
  color: var(--Black, #000);
}
.col-text :deep(p + .services-text__sub),
.col-text :deep(div + .services-text__sub),
.col-text :deep(ul + .services-text__sub),
.col-text :deep(ol + .services-text__sub){ margin-top: 1.25rem; }
.services-text__sub + .services-text__desc{ margin-top: .45rem; }

/* ===== TEXT-ONLY: střed přes celou šířku ===== */
.services-text--centered .container { width: 100%; } /* jistota, že nic neomezí šířku sekce */
.services-text--centered .grid.grid--center{
  display: flex;
  justify-content: center;   /* vycentruj celý článek napříč šířkou */
  width: 100%;
}
.services-text--centered .col-text--center{
  max-width: min(68ch, 820px); /* čitelné řádky */
  margin-inline: auto;
  text-align: center;
}
.services-text--centered .col-text--center :deep(ul),
.services-text--centered .col-text--center :deep(ol){
  display: inline-block;  /* aby se seznamy daly centrovat uvnitř text-align:center */
  text-align: left;       /* ale samotné odrážky zůstanou vlevo */
  margin-inline: auto;
}

/* ===== MOBILE (<=992px) ===== */
@media (max-width: 992px){
  .services-text.services-text--split-clean .grid.grid--tight,
  .services-text.services-text--split-clean .grid.grid--tight.grid--mirror {
    grid-template-columns: 1fr !important;
    grid-template-areas:
      "text"
      "image";
    gap: clamp(8px, 2.5vw, 12px) !important;
  }
  .services-text.services-text--split-clean .grid.grid--tight > .col-text { grid-area: text; }
  .services-text.services-text--split-clean .grid.grid--tight > .media    { grid-area: image; }

  .services-text.services-text--split-clean .grid.grid--tight:not(.grid--mirror) > .media:last-child,
  .services-text.services-text--split-clean .grid.grid--tight.grid--mirror > .media:first-child {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .services-text.services-text--split-clean .grid.grid--2col{
    grid-template-columns: 1fr;
    row-gap: clamp(8px, 2.5vw, 12px);
    align-items: start;
  }
  .columns-header{ margin-bottom: .5rem; }

  .services-text.services-text--split-clean.match-text .grid.grid--tight,
  .services-text.services-text--split-clean.match-text .grid.grid--tight.grid--mirror{ align-items: start; }
  .services-text.services-text--split-clean.match-text .media{ height: auto; }
  .services-text.services-text--split-clean.match-text .media--auto{ max-height: none; }
  .services-text.services-text--split-clean.match-text .media--auto img{ height: auto; object-fit: initial; }

  .media--auto{ aspect-ratio: auto !important; max-width: 100%; max-height: none; }
  .media--auto img{ height: auto; object-fit: initial; }

  /* text-only na mobilu klidně o něco širší */
  .services-text--centered .col-text--center{ max-width: 90vw; }
}

/* lists */
.col-text :deep(ul),
.col-text :deep(ol){ margin: .4rem 0 .6rem; padding-left: 1.25em; }
.col-text :deep(ul){ list-style: disc; }
.col-text :deep(ol){ list-style: decimal; }
.col-text :deep(li){ margin: .2rem 0; line-height: 1.6; color: var(--Base-700); }
.col-text :deep(ul ul){ list-style: circle; margin-top: .2rem; }
.col-text :deep(ol ol){ list-style: lower-alpha; margin-top: .2rem; }

/* jemnější značky v center variantě */
.services-text--centered .col-text--center :deep(ul li)::marker { font-size: .9em; }
.services-text--centered .col-text--center :deep(ol li)::marker { font-weight: 700; }

/* volitelné zvýraznění <mark> */
.col-text :deep(mark){
  background: #fff3a3;
  padding: 0.05em 0.15em;
  border-radius: 0.15em;
}
</style>
