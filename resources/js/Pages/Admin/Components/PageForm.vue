<script setup>
import { reactive, computed } from 'vue'
import { useForm } from '@inertiajs/vue3'

import HeroCard            from '@/Pages/Admin/Components/PageFormSections/HeroCard.vue'
import AboutCard           from '@/Pages/Admin/Components/PageFormSections/AboutCard.vue'
import InfrastructureCard  from '@/Pages/Admin/Components/PageFormSections/InfrastructureCard.vue'
import GalleryCard         from '@/Pages/Admin/Components/PageFormSections/GalleryCard.vue'
import CompanyCard         from '@/Pages/Admin/Components/PageFormSections/CompanyCard.vue'
import ContactCard         from '@/Pages/Admin/Components/PageFormSections/ContactCard.vue'
import MapCard             from '@/Pages/Admin/Components/PageFormSections/MapCard.vue'

const props = defineProps({
  slug: { type: String, required: true },
  initial: { type: Object, default: () => ({}) },
})

/* Feature switche dle slugu */
const aboutEnabled   = computed(() => props.slug === 'o-nas')
const contactEnabled = computed(() => props.slug === 'kontakt')

/* Pomocné validátory */
const emailOk = (s) => /^\S+@\S+\.\S+$/.test(s || '')
const phoneOk = (s) => (s || '').replace(/\s+/g,'').length >= 5

/* Stabilní ID */
const uid = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`

/** Udrž 4 položky galerie a doplň meta + stabilní id */
function ensureFour(arr) {
  let out = Array.isArray(arr) ? arr.slice(0, 4) : []
  while (out.length < 4) out.push({ title: '', alt: '', src: null })
  return out.map((g, i) => ({
    id: g?.id ?? `g${i}-${uid()}`,
    title: g?.title || '',
    alt: g?.alt || '',
    imageUrl: g?.src || null,
    imageFile: null,
  }))
}

const content = reactive({
  hero: {
    title:    props.initial?.content?.hero?.title    || '',
    subtitle: props.initial?.content?.hero?.subtitle || '',
    image:    props.initial?.content?.hero?.image    || null,
    imageFile: null,
    counters: aboutEnabled.value
      ? (props.initial?.content?.hero?.counters || []).map(c => ({
          label: c?.label || '',
          value: c?.value || ''
        }))
      : []
  },
  data: aboutEnabled.value
    ? {
        about: {
          title: props.initial?.content?.data?.about?.title || 'O nás',
          text:  props.initial?.content?.data?.about?.text  || '',
          image: {
            src:  props.initial?.content?.data?.about?.image?.src || null,
            file: null
          }
        },
        infrastructure: {
          lead: props.initial?.content?.data?.infrastructure?.lead || '',
          blocks: (
            props.initial?.content?.data?.infrastructure?.blocks || [
              { title: '', items: [{ badge: '', text: '' }] },
              { title: '', items: [{ badge: '', text: '' }] }
            ]
          ).map(b => ({
            title: b?.title || '',
            items: Array.isArray(b?.items) && b.items.length
              ? b.items.map(it => ({
                  badge: it?.badge || it?.key || '',
                  text:  it?.text  || it?.value || '',
                }))
              : [{ badge: '', text: '' }],
          }))
        },
        gallery: ensureFour(props.initial?.content?.data?.gallery || []),
      }
    : contactEnabled.value
    ? {
        company: {
          name:     props.initial?.content?.data?.company?.name     || '',
          ic:       props.initial?.content?.data?.company?.ic       || '',
          dic:      props.initial?.content?.data?.company?.dic      || '',
          registry: props.initial?.content?.data?.company?.registry || '',
        },
        contacts: {
          note:    props.initial?.content?.data?.contacts?.note    || '',
          address: props.initial?.content?.data?.contacts?.address || '',
          email:   props.initial?.content?.data?.contacts?.email   || '',
          phone:   props.initial?.content?.data?.contacts?.phone   || '',
        },
        map: {
          embed: props.initial?.content?.data?.map?.embed || '',
          link:  props.initial?.content?.data?.map?.link  || '',
        }
      }
    : {}
})

/* -------- Validace -------- */
const canSave = computed(() => {
  const okTitle = !!content.hero.title?.trim()
  const okSub   = !!content.hero.subtitle?.trim()
  const hasImg  = !!content.hero.imageFile || !!(content.hero.image && String(content.hero.image).trim() !== '')

  if (aboutEnabled.value) return okTitle && okSub && hasImg
  if (contactEnabled.value) {
    const c = content.data.contacts || {}
    return okTitle && okSub && hasImg && emailOk(c.email) && phoneOk(c.phone)
  }
  return okTitle && okSub && hasImg
})

/* -------- Sestavení payloadu (JSON část) -------- */
function buildPayloadJson() {
  if (aboutEnabled.value) {
    return {
      hero: {
        title: content.hero.title,
        subtitle: content.hero.subtitle,
        image: content.hero.imageFile ? null : content.hero.image,
        counters: (content.hero.counters || []).map(c => ({ label: c.label, value: c.value })),
      },
      data: {
        about: {
          title: content.data.about.title,
          text:  content.data.about.text,
          image: content.data.about.image.file ? null : { src: content.data.about.image.src },
        },
        infrastructure: {
          lead: content.data.infrastructure.lead,
          blocks: content.data.infrastructure.blocks.map(b => ({
            title: b.title,
            items: (b.items || []).map(it => ({ badge: it.badge, text: it.text })),
          })),
        },
        gallery: (content.data.gallery || []).map(g => ({
          title: g.title,
          alt:   g.alt,
          src:   g.imageFile ? null : g.imageUrl,
        })),
      }
    }
  }

  // kontakt + ostatní
  return {
    hero: {
      title: content.hero.title,
      subtitle: content.hero.subtitle,
      image: content.hero.imageFile ? null : content.hero.image,
    },
    data: {
      company: { ...(content.data.company || {}) },
      contacts:{ ...(content.data.contacts || {}) },
      map:     { ...(content.data.map || {}) },
    }
  }
}

/* -------- Inertia useForm – kvůli processing/errors -------- */
const form = useForm({
  hero_title: '',
  hero_subtitle: '',
  hero_image: /** @type {File|null} */(null),
  about_image: /** @type {File|null} */(null),
  gallery_images: /** @type {(File|null)[]} */([]),
  payload: ''
})

function save() {
  form.hero_title   = content.hero.title || ''
  form.hero_subtitle= content.hero.subtitle || ''
  form.hero_image   = content.hero.imageFile || null
  form.payload      = JSON.stringify(buildPayloadJson())

  if (aboutEnabled.value) {
    form.about_image   = content.data.about.image.file || null
    form.gallery_images= (content.data.gallery || []).map(g => g.imageFile || null)
  } else {
    form.about_image   = null
    form.gallery_images= []
  }

  form.post(`/admin/pages/${props.slug}`, {
    forceFormData: true,
    preserveScroll: true,
    onError: () => { },
    onSuccess: () => { },
  })
}
</script>

<template>
  <div class="pageform">
    <!-- HERO -->
    <HeroCard v-model="content.hero" :about-enabled="aboutEnabled" />

    <!-- ABOUT PAGE -->
    <template v-if="aboutEnabled">
      <AboutCard v-model="content.data.about" />
      <InfrastructureCard v-model="content.data.infrastructure" />
      <!-- Galerie po DVOU sloupcích -->
      <GalleryCard v-model="content.data.gallery" />
    </template>

    <!-- CONTACT PAGE -->
    <template v-if="contactEnabled">
      <CompanyCard  v-model="content.data.company" />
      <ContactCard  v-model="content.data.contacts" />
      <MapCard      v-model="content.data.map" />
    </template>

    <!-- ACTIONS -->
    <div class="actions-bottom">
      <button class="btn btn-primary" :disabled="!canSave || form.processing" @click="save">
        <span v-if="form.processing"><i class="fa-solid fa-spinner fa-spin me-2" /></span>
        Uložit změny
      </button>
    </div>

    <!-- globální výpis chyb validace -->
    <div v-if="Object.keys(form.errors).length" class="alert alert-danger mt-3">
      <div v-for="(msg, key) in form.errors" :key="key">{{ msg }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pageform{
  display:flex;
  flex-direction:column;
  gap:16px;
}

.actions-bottom{
  position: sticky;
  bottom: 0;
  display:flex;
  justify-content:flex-end;
  padding:12px 0 2px;
  background: linear-gradient(180deg, transparent, #f8fafc 40%);
}

.pageform :deep(.card-wrap){ width:100%; }

.pageform :deep(.card-head){
  display:flex;
  align-items:center;
  justify-content:flex-start; 
  gap:12px;
  padding:14px 18px;
  border:1px solid #e5e7eb;
  border-radius:14px;
  background:#fff;
  user-select:none;
  transition: background .15s, border-color .15s, box-shadow .15s;
  box-shadow: 0 1px 0 rgba(16,24,40,.04);
  width:100%;
  text-align:left;           
}
.pageform :deep(.card-head.clickable){ cursor:pointer; }
.pageform :deep(.card-head.clickable:hover){ background:#f8fafc; }

.pageform :deep(.card-head .chev){
  width:32px; height:32px;
  display:grid; place-items:center;
  border-radius:10px;
  border:1px solid #e9eaeb;
  background:#fff; color:#111827;
  transition: transform .2s ease, background .15s ease;
  flex:0 0 auto;
  margin-right:8px;  
}
.pageform :deep(.card-head:hover .chev){ background:#f3f4f6; }
.pageform :deep(.card-head .chev.open i){ transform:rotate(180deg); }

.pageform :deep(.card-head .title){
  margin:0;
  color:#0f172a;
  font-family:"Sora", system-ui, sans-serif;
  font-weight:800;
  font-size:18px;
  line-height:1.28;
  letter-spacing:.005em;
  flex:1 1 auto;
  text-align:left;
}

.pageform :deep(.card-head.open){
  background:#f8fafc;
  border-bottom-left-radius:0;
  border-bottom-right-radius:0;
  border-color:#e5e7eb;
  box-shadow: inset 0 -1px 0 #eef0f2, 0 1px 0 rgba(16,24,40,.03);
}

.pageform :deep(.card-body){
  padding:20px;
  border:1px solid #e5e7eb;
  border-top:0;
  border-bottom-left-radius:14px;
  border-bottom-right-radius:14px;
  background:#fff;
  width:100%;
}

.pageform :deep(h2),
:deep(.admin-content .container-fluid h2){
  font: 800 22px/1.3 "Sora",system-ui,sans-serif;
  margin: 0 0 14px;
}

.grid{ display:grid; gap:12px; }

.grid.two{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (max-width:768px){ .grid.two{ grid-template-columns: 1fr; } }

.btn{ cursor:pointer; }
.btn-ghost{
  width:36px; height:36px; border-radius:12px; border:1px solid #e9eaeb;
  background:#fff; display:grid; place-items:center; color:#111827; transition:.15s;
}
.btn-ghost:hover{ background:#f8fafc; transform: translateY(-1px); }
.btn-ghost.danger{ color:#b4231f; border-color:#fde2e1; }
.btn-ghost.danger:hover{ background:#fff5f5; }

.text-muted{ color:#7b8089; }
.label{
  display:block; font-size:13px; font-weight:700;
  color:#6b7280; margin-bottom:8px;
}
.items-label{
  font-size:13px; font-weight:800; color:#6b7280;
  text-transform:uppercase; letter-spacing:.04em;
}

.pageform :deep(.dropzone){
  min-height:220px;
  width:100%;
}
</style>
