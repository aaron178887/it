import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import {
  HREF_PREFIX,
  NAV_ORDER,
  CATEGORY_LABEL_BY_SLUG,
} from '@/Helpers/services.constants.js'

const ALLOWED = new Set(NAV_ORDER)
const stripDiacritics = (s='') => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
const toSlugKey = (s='') => {
  const raw = stripDiacritics(String(s).trim().toLowerCase())
  if (ALLOWED.has(raw)) return raw
  if (raw.startsWith('server'))   return 'servery'
  if (raw.startsWith('aplikac'))  return 'aplikace'
  if (raw.startsWith('kontej'))   return 'kontejnery'
  return ''
}

export function useNavServices (options = {}) {
  const { preferredOrder = NAV_ORDER, hrefPrefix = HREF_PREFIX } = options

  const page     = usePage()
  const getProps = () => (page?.props?.value ?? page?.props ?? {})
  const raw      = computed(() => getProps().navServices ?? [])

  const buildHref = (slug) => {
    const base = String(hrefPrefix).replace(/\/+$/, '')
    const s    = String(slug || '').replace(/^\/+/, '')
    return `${base}/${s}`
  }

  const categories = computed(() => {
    const buckets = new Map() // slug -> { key, slug, title/name/label/heading, items:[] }

    const ensureBucket = (slug) => {
      if (!buckets.has(slug)) {
        const label = CATEGORY_LABEL_BY_SLUG[slug] || slug
        buckets.set(slug, {
          key: slug,
          slug,
          title: label,
          name:  label,   // ⬅️ pro Header.vue
          label: label,   // ⬅️ kompatibilita
          heading: label, // ⬅️ kompatibilita
          items: [],
        })
      }
      return buckets.get(slug)
    }

    const addItem = (catLike, it) => {
      const slugKey = toSlugKey(catLike)
      if (!slugKey || !ALLOWED.has(slugKey)) return
      const b = ensureBucket(slugKey)

      const slugFromHref = String((it?.href || '').split('/').pop() || '').trim()
      const slug = it?.slug || slugFromHref
      const href = it?.href || buildHref(slug)

      b.items.push({ ...it, slug, href })
    }

    const arr = Array.isArray(raw.value) ? raw.value : []
    arr.forEach(entry => {
      if (Array.isArray(entry?.items)) {
        const catLike = entry.slug || entry.name || entry.category
        entry.items.forEach(it => addItem(catLike, it))
      } else {
        addItem(entry.category ?? entry.name ?? entry.slug, entry)
      }
    })

    const uniqBy = (arr, keyFn) => {
      const seen = new Set()
      return arr.filter(it => {
        const k = keyFn(it)
        if (!k) return true
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
    }

    // finální pořadí + deduplikace + ponechání aliasů title/name/label/heading
    return preferredOrder
      .map(slug => buckets.get(slug))
      .filter(Boolean)
      .map(c => ({
        ...c,
        items: uniqBy(c.items, it => String(it.slug || it.href || '').toLowerCase())
          .sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'cs')),
      }))
  })

  const cols = computed(() =>
    categories.value.map(c => ({
      key: c.key, slug: c.slug,
      title: c.title, name: c.name, label: c.label, heading: c.heading,
      items: c.items,
    }))
  )

  // inline SVG helper
  const SVG_KEYS_INLINE = ['menu_icon_svg', 'icon_svg', 'svg', 'icon']
  const isSvg  = v => typeof v === 'string' && /^\s*<svg[\s>]/i.test(v)
  const svgForItem = (it = {}) => {
    for (const k of SVG_KEYS_INLINE) if (isSvg(it?.[k])) return it[k]
    return ''
  }

  return { categories, cols, svgForItem }
}
