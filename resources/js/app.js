import { createApp, h } from 'vue'
import { createInertiaApp, Head, Link } from '@inertiajs/vue3'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'

import '../css/style.scss' // globál

// (volitelně) progress pro @inertiajs/progress 0.2.x
if (typeof window !== 'undefined') {
  import('@inertiajs/progress').then(m => {
    m.InertiaProgress?.init?.({ showSpinner: false, delay: 250, includeCSS: true })
  })
}

createInertiaApp({
  title: t => `${t ? `${t} | ` : ''}${import.meta.env.VITE_APP_NAME || 'App'}`,
  resolve: name => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
  setup({ el, App, props, plugin }) {
    const app = createApp({ render: () => h(App, props) })
    app.use(plugin)
    app.component('Head', Head)
    app.component('Link', Link)
    app.mount(el)
  },
})
