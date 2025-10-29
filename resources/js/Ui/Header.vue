<!-- resources/js/Ui/Header.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, Teleport } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { useNavServices } from '@/Helpers/navServices.js'

const headerEl = ref(null)
const mobileMenuEl = ref(null)
const isMobileOpen   = ref(false)
const showMobile     = ref(false)
const isServicesOpen = ref(false)
const isMegaOpen     = ref(false)

const menuTop = ref(80)
const menuTopPx = computed(() => `${Math.max(0, Math.round(menuTop.value))}px`)

function rafThrottle (fn) {
  let token = null
  return (...args) => {
    if (token) return
    token = requestAnimationFrame(() => {
      token = null
      fn(...args)
    })
  }
}

const measureHeader = rafThrottle(() => {
  const r = headerEl.value?.getBoundingClientRect()
  menuTop.value = (r?.bottom ?? 64) + 8
})

const { categories, svgForItem } = useNavServices()

const page      = usePage()
const site      = computed(() => page.props?.site ?? {})
const phoneRaw  = computed(() => site.value?.contacts?.phone ?? null)
const telDigits = computed(() => (phoneRaw.value ?? '').replace(/[^\d+]/g, ''))
const telHref   = computed(() => telDigits.value ? `tel:${telDigits.value}` : '/kontakt')
const displayPhone = computed(() =>
  (phoneRaw.value || '+420 733 482 481').replace(/\s/g, '\u00A0')
)

/* ===== actions ===== */
function openMobile () {
  showMobile.value = true
  nextTick(() => {
    isMobileOpen.value = true
    document.body.style.overflow = 'hidden'
    document.body.classList.add('mobile-open')
  })
}
function closeMobile () {
  isMobileOpen.value = false
  document.body.style.overflow = ''
  document.body.classList.remove('mobile-open')
}
function toggleMobile () { isMobileOpen.value ? closeMobile() : openMobile() }
function toggleServices () { isServicesOpen.value = !isServicesOpen.value }
function openMega (v) { isMegaOpen.value = v }
function toggleMega () { isMegaOpen.value = !isMegaOpen.value }

/* ===== lifecycle ===== */
let onResize, onTransitionEnd, onDocClick, megaEl, ro

onMounted(() => {
  measureHeader()

  onResize = () => measureHeader()
  window.addEventListener('resize', onResize, { passive: true })

  onTransitionEnd = (e) => {
    if (e.target !== mobileMenuEl.value) return
    if (!isMobileOpen.value) showMobile.value = false
  }
  nextTick(() => {
    mobileMenuEl.value?.addEventListener('transitionend', onTransitionEnd)
  })

  megaEl = document.querySelector('.nav-item.mega')
  onDocClick = (e) => {
    if (megaEl && !megaEl.contains(e.target)) isMegaOpen.value = false
  }
  document.addEventListener('click', onDocClick, { passive: true })

  if ('ResizeObserver' in window && headerEl.value) {
    ro = new ResizeObserver(() => measureHeader())
    ro.observe(headerEl.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  mobileMenuEl.value?.removeEventListener('transitionend', onTransitionEnd)
  document.removeEventListener('click', onDocClick)
  if (ro) ro.disconnect()
  document.body.style.overflow = ''
  document.body.classList.remove('mobile-open')
})
</script>

<template>
  <header class="site-header" role="banner">
    <div class="navbar-shell">
      <nav class="navbar-inner" ref="headerEl">
        <Link class="brand" href="/">
          <img :src="'/images/logo.png'" alt="ITGlobe logo" class="brand-logo" />
        </Link>

        <ul class="nav-list">
          <li class="nav-item"><Link class="nav-link" href="/">Úvod</Link></li>

          <li class="nav-item mega" @mouseenter="openMega(true)" @mouseleave="openMega(false)">
            <button class="nav-link mega-trigger" type="button" aria-haspopup="true" :aria-expanded="isMegaOpen"
                    @click="toggleMega" @keydown.enter.prevent="toggleMega" @keydown.space.prevent="toggleMega">
              Služby
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" class="caret">
                <path d="M5.5 7.5L10 12.5L14.5 7.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <div class="mega-panel" role="menu" aria-label="Služby" v-show="isMegaOpen" @keydown.esc.stop.prevent="openMega(false)">
              <template v-if="categories.length">
                <div class="mega-grid">
                  <div class="mega-col" v-for="cat in categories" :key="cat.slug">
                    <div class="mega-title">{{ cat.name }}</div>
                    <ul class="mega-list">
                      <li v-for="it in cat.items" :key="it.slug">
                        <Link class="mega-item" :href="it.href">
                          <span v-if="svgForItem(it)" class="ico" v-html="svgForItem(it)" aria-hidden="true"></span>
                          <span>{{ it.title }}</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="mega-empty">Zatím žádné služby.</div>
              </template>
            </div>
          </li>

          <li class="nav-item"><Link class="nav-link" href="/reference">Reference</Link></li>
          <li class="nav-item"><Link class="nav-link" href="/o-nas">O nás</Link></li>
          <li class="nav-item"><Link class="nav-link" href="/kontakt">Kontakt</Link></li>
        </ul>

        <div class="nav-actions">
          <a
            class="btn-cta"
            :href="telHref"
            :aria-label="`Zavolat na číslo ${displayPhone}`"
          >
            <svg class="ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.81.3 1.6.57 2.35a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.73-1.73a2 2 0 0 1 2.11-.45c.75.27 1.54.45 2.35.57A2 2 0 0 1 22 16.92z"
                    fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ displayPhone }}</span>
          </a>
        </div>

        <button class="hamburger" aria-label="Otevřít menu" aria-controls="navbar-mobile"
                :aria-expanded="isMobileOpen" @click="toggleMobile">
          <svg class="ico-menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" aria-hidden="true" v-show="!isMobileOpen">
            <path d="M4 5H20M4 12H20M4 19H20" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg class="ico-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" aria-hidden="true" v-show="isMobileOpen">
            <path d="M18 6L6 18M6 6l12 12" stroke="#F52130" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </nav>
    </div>

    <!-- === Teleport: mobilní menu === -->
    <Teleport to="body">
      <div id="navbar-mobile"
        class="mobile-menu"
        ref="mobileMenuEl"
        :class="{ 'is-open': isMobileOpen, 'd-none': !showMobile }"
        :style="{ '--menu-top': menuTopPx }"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        :aria-hidden="(!isMobileOpen).toString()">

        <nav class="mm-links" aria-label="Mobilní">
          <Link class="mm-link" href="/" @click="closeMobile">Úvod</Link>

          <button class="mm-accordion" :aria-expanded="isServicesOpen" aria-controls="mm-services-panel" @click="toggleServices">
            <span>Služby</span>
            <svg class="mm-caret" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5.5 7.5L10 12.5L14.5 7.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div id="mm-services-panel" class="mm-panel" :class="{ 'is-open': isServicesOpen }" v-show="isServicesOpen">
            <template v-if="categories.length">
              <template v-for="cat in categories" :key="cat.slug">
                <div class="mm-cat-title">{{ cat.name }}</div>
                <Link class="mm-sub" v-for="it in cat.items" :key="it.slug" :href="it.href" @click="closeMobile">
                  <span v-if="svgForItem(it)" class="ico" v-html="svgForItem(it)" aria-hidden="true"></span>
                  <span>{{ it.title }}</span>
                </Link>
              </template>
            </template>
            <template v-else>
              <div class="mm-empty">Zatím žádné služby.</div>
            </template>
          </div>

          <Link class="mm-link" href="/reference" @click="closeMobile">Reference</Link>
          <Link class="mm-link" href="/o-nas" @click="closeMobile">O nás</Link>
          <Link class="mm-link" href="/kontakt" @click="closeMobile">Kontakt</Link>
        </nav>

        <Link class="btn-cta mm-cta" href="/kontakt" @click="closeMobile">Začít</Link>
      </div>
    </Teleport>
  </header>
</template>

<style scoped lang="scss">
/* ====== Header shell ====== */
.site-header { position: relative; z-index: 1300; }
.navbar-shell {
  position: absolute; top: 30px; left: 50%; transform: translateX(-50%);
  width: min(1320px, calc(100% - 48px)); height: 72px; padding: 0 32px;
  display: flex; align-items: center; border-radius: 12px; background: #fff;
  box-shadow: 0 6px 24px rgba(0,0,0,.06);
}

/* ====== LAYOUT: fixní slot pro logo, menu vlevo ====== */
.navbar-inner{
  --brandSlot: 260px;                
  display: grid;
  grid-template-columns: var(--brandSlot) 1fr auto;
  align-items: center;
  gap: 80px;
  width: 100%;
}
.brand{ display:flex; align-items:center; min-width:0; }

/* Logo – větší, ale držet výšku headeru */
.brand-logo{
  width: 210px;
  height: auto;
  max-height: 56px;
  object-fit: contain;
  object-position: left center;
  display: block;
  -webkit-user-drag: none;
  user-select: none;
}

/* ===== Desktop nav – vlevo ===== */
.nav-list{
  list-style:none; margin:0; padding:0;
  display:flex; align-items:center; gap:32px; justify-content:flex-start;
  .nav-item { position: relative; }
  .nav-link{
    color:#000; font:500 16px/1 "Plus Jakarta Sans",system-ui,sans-serif;
    display:inline-flex; align-items:center; gap:6px; text-decoration:none;
    transition:color .15s ease;
    &:hover{ color:#F52130; }
    &:focus-visible{
      outline:2px solid color-mix(in srgb, #F52130 40%, transparent);
      outline-offset:2px; border-radius:6px;
    }
  }
}
.nav-actions{ display:flex; align-items:center; gap:16px; justify-self:end; }

.btn-cta{
  display:inline-flex; align-items:center; gap:10px;
  text-decoration:none;
}
.btn-cta .ico{
  width:18px; height:18px; display:inline-block;
}

/* Hamburger */
.hamburger{
  display:none; background:none; border:0; padding:0; cursor:pointer; line-height:0; width:24px; height:24px;
  .ico-menu{ display:block; } .ico-close{ display:none; }
  &[aria-expanded="true"]{ .ico-menu{ display:none; } .ico-close{ display:block; } }
}

/* Mega menu (desktop) */
@media (min-width: 992px) {
  .nav-list { gap: 36px; }
  .nav-item.mega{
    position:relative;
    &::after{ content:""; position:absolute; left:0; top:100%; width:100%; height:16px; }
    .mega-trigger{
      all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:6px;
      color:#000; font:500 17px/1.2 "Plus Jakarta Sans",system-ui,sans-serif;
      .caret{ transition: transform .18s ease; }
      &:hover{ color:#F52130; }
      &:focus-visible{ outline:2px solid color-mix(in srgb, #F52130 40%, transparent); outline-offset:2px; border-radius:6px; }
    }
    .mega-panel{
      position:absolute; left:50%; top:calc(100% + 12px);
      transform:translateX(-50%) translateY(6px);
      width:min(880px, calc(100vw - 48px));
      padding:22px 24px; background:#fff; border-radius:14px; border:1px solid #e9eaeb;
      box-shadow:0 24px 60px rgba(0,0,0,.12), 0 6px 18px rgba(0,0,0,.06);
      opacity:0; pointer-events:none; transition:opacity .16s ease, transform .16s ease; z-index:1;
    }
    .mega-grid{ display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:12px 28px; }
    .mega-title{ color:#414651; font:700 12px/1 "Plus Jakarta Sans"; letter-spacing:.02em; opacity:.9; margin:4px 0 10px; }
    .mega-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:4px; }
    .mega-item{
      display:grid; grid-template-columns:30px 1fr; align-items:center; column-gap:10px;
      padding:8px 10px; border-radius:10px; color:#111827; text-decoration:none;
      font:600 15px/1.25 "Plus Jakarta Sans";
      transition:background-color .15s ease, color .15s ease, transform .1s ease;
      .ico{
        width:18px; height:18px; flex:0 0 18px; color:#616977;
        background:#f3f4f6; border-radius:8px; padding:6px; box-sizing:content-box;
        transition: background-color .15s ease, color .15s ease, transform .1s ease;
      }
      &:hover{ background:#f6f7f9; color:#F52130; transform:translateX(1px); }
      &:hover .ico{ color:#F52130; background: color-mix(in srgb, #F52130 12%, white); }
      &:focus-visible{ outline:2px solid color-mix(in srgb, #F52130 35%, transparent); outline-offset:2px; }
    }
    &:hover .mega-panel,
    &:focus-within .mega-panel{ opacity:1; transform:translateX(-50%) translateY(0); pointer-events:auto; }
    &:hover .mega-trigger .caret,
    &:focus-within .mega-trigger .caret{ transform: rotate(180deg); }
  }
}

/* Tablet + Mobile */
@media (max-width: 992px) {
  .nav-list, .nav-actions { display: none !important; }
  .navbar-inner{ grid-template-columns: 1fr auto; --brandSlot: auto; }
  .hamburger{
    display: inline-flex; width: 40px; height: 40px; padding: 0; border: 0; background: transparent; border-radius: 8px;
    &:focus-visible{ outline:2px solid color-mix(in srgb, #F52130 40%, transparent); outline-offset:2px; }
  }
}

/* MOBILE header karta */
@media (max-width: 576px){
  .navbar-shell{
    position: fixed; top: max(8px, env(safe-area-inset-top)); left: 0; right: 0;
    transform: none; width: 100%; height: auto; padding: 0; background: transparent; box-shadow: none; z-index: 1300;
  }
  .navbar-inner{
    width: calc(100% - 16px); margin: 0 auto; padding: 10px;
    border-radius: 12px; background:#fff; display:grid; align-items:center;
    box-shadow: 0 6px 24px rgba(0,0,0,.06); border: 1px solid rgba(0,0,0,.04); gap: 10px;
  }
}

/* ===== Mobile menu panel ===== */
.mobile-menu{
  position: fixed; top: var(--menu-top, 80px); left: 8px; right: 8px; padding: 16px;
  border-radius: 12px; background: #fff; border: 1px solid rgba(0,0,0,.06);
  box-shadow: 0 18px 60px rgba(0,0,0,.14), 0 6px 18px rgba(0,0,0,.08);
  display:flex; flex-direction:column; gap:12px; z-index: 1400;

  max-height: calc(100dvh - var(--menu-top, 80px) - max(8px, env(safe-area-inset-bottom)));
  overflow: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;

  opacity: 0; pointer-events: none; transform: translateY(-10px) scale(.98);
  transition: opacity .25s ease, transform .25s ease;

  &.is-open{ opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }

  .mm-links{ display:flex; flex-direction:column; gap:12px; }

  .mm-link{
    font:700 16px/24px "Sora", system-ui, sans-serif; color:#000; text-decoration:none; padding:8px 6px; border-radius:8px;
    &:active{ background:#f6f7f9; }
    &:focus-visible{ outline:2px solid color-mix(in srgb, #F52130 35%, transparent); outline-offset:2px; }
  }

  .mm-accordion{
    display:flex; justify-content:space-between; align-items:center; gap:12px; background:transparent; border:0; padding:8px 6px; cursor:pointer; border-radius:8px;
    span{ font:700 16px/24px "Sora", system-ui, sans-serif; color:#000; text-align:left; }
    .mm-caret{ transition: transform .2s ease; }
    &[aria-expanded="true"] .mm-caret{ transform: rotate(180deg); }
    &:active{ background:#f6f7f9; }
    &:focus-visible{ outline:2px solid color-mix(in srgb, #F52130 35%, transparent); outline-offset:2px; }
  }

  .mm-panel{
    display:flex; flex-direction:column; gap:6px;
    max-height: 0; opacity: 0; padding: 0 6px;
    overflow: hidden;
    transition:max-height .28s ease, opacity .28s ease, padding .28s ease;
  }
  .mm-panel.is-open{
    max-height: calc(100svh - var(--menu-top, 80px) - 160px);
    max-height: calc(100dvh - var(--menu-top, 80px) - 160px);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    opacity: 1; padding: 8px 6px 2px;
  }

  .mm-sub{
    display:grid; grid-template-columns:30px 1fr; align-items:center; column-gap:10px; padding:10px 10px; border-radius:10px; background:#f5f5f5;
    color:#000; font:600 16px/1.25 "Plus Jakarta Sans", sans-serif; text-decoration:none; transition:background-color .15s ease, color .15s ease, transform .1s ease;
    .ico{
      width:18px; height:18px; flex:0 0 18px; color:#616977; background:#f3f4f6; border-radius:8px; padding:6px; box-sizing:content-box;
      transition: background-color .15s ease, color .15s ease, transform .1s ease;
    }
    &:hover{ background:#f6f7f9; color:#F52130; transform: translateX(1px); }
    &:hover .ico{ color:#F52130; background: color-mix(in srgb, #F52130 12%, white); }
    &:focus-visible{ outline:2px solid color-mix(in srgb, #F52130 35%, transparent); outline-offset:2px; }
  }

  .mm-cta{ align-self:stretch; margin-top:6px; }
}

.mm-cat-title{ font-weight:700; font-size:12px; opacity:.9; margin:8px 6px 4px; }
.mega-empty,.mm-empty{ padding:12px; opacity:.7; }
.mega-item .ico, .mm-sub .ico{ display:inline-flex; width:20px; height:20px; margin-right:8px; align-items:center; justify-content:center; }
.mega-item .ico :deep(svg), .mm-sub .ico :deep(svg){ width:20px; height:20px; display:block; stroke: currentColor; fill: none; }
</style>

<style lang="scss">
@media (max-width: 768px){
  body.mobile-open::after{
    content:""; position: fixed; inset: 0;
    background: rgba(0,0,0,.36);
    -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px);
    z-index: 1200; pointer-events: auto;
  }
}
</style>
