/* =========
 * Single source of truth – kategorie
 * ========= */
export const CATEGORIES = [
  { key: 'server',    slug: 'servery',    label: 'Servery' },
  { key: 'aplikace',  slug: 'aplikace',   label: 'Aplikace' },
  { key: 'kontejner', slug: 'kontejnery', label: 'Kontejnery' },
];

/* =========
 * Lookupy
 * ========= */
export const BY_KEY   = Object.fromEntries(CATEGORIES.map(c => [c.key,  c]));
export const BY_SLUG  = Object.fromEntries(CATEGORIES.map(c => [c.slug, c]));
export const BY_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.label, c.key]));

// key -> slug (UI → backend)
export const CATEGORY_MAP     = Object.fromEntries(CATEGORIES.map(c => [c.key,  c.slug]));
// slug -> key (backend → UI)
export const CATEGORY_REVERSE = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.key]));

// slug -> label (ideální pro tabulky/detail)
export const CATEGORY_DISPLAY = Object.fromEntries(CATEGORIES.map(c => [c.slug, c.label]));
export const CATEGORY_LABEL_BY_SLUG = CATEGORY_DISPLAY; // alias
export const CATEGORY_LABEL_BY_KEY  = Object.fromEntries(CATEGORIES.map(c => [c.key, c.label]));

/* =========
 * Navigace / base path
 * ========= */
export const HREF_PREFIX = '/sluzby';
export const BASE_SERVICE_PATH = `${String(HREF_PREFIX).replace(/\/+$/, '')}/`;

/* =========
 * Pořadí pro nav/footer
 *  → přesně: Servery, Aplikace, Kontejnery
 * ========= */
export const NAV_ORDER          = CATEGORIES.map(c => c.slug);        // ['servery','aplikace','kontejnery']
export const NAV_FOOTER         = [...NAV_ORDER];
export const NAV_ORDER_REVERSED = [...NAV_ORDER].reverse();

/* =========
 * Options pro UI (chips/select)
 * ========= */
export const CATEGORY_OPTS = CATEGORIES.map(c => ({
  value: c.key,
  label: c.label,
  key:   c.key,
  slug:  c.slug,
}));

/* =========
 * Helpery
 * ========= */
export const hrefOf = (slug) => {
  const base = String(HREF_PREFIX).replace(/\/+$/, '');
  const s    = String(slug ?? '').replace(/^\/+/, '');
  return `${base}/${s}`;
};

export const keyToLabel = (key)   => BY_KEY[key]?.label ?? String(key);
export const labelToKey = (label) => BY_LABEL[label] ?? String(label);
export const keyToSlug  = (key)   => CATEGORY_MAP[key] ?? String(key);
export const slugToKey  = (slug)  => CATEGORY_REVERSE[slug] ?? String(slug);
