import { ref, computed, onMounted, onBeforeUnmount, mergeProps, unref, withCtx, createVNode, createTextVNode, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext, mergeModels, useModel, watch, reactive, nextTick, resolveComponent, createSSRApp, h } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link, Head, router, useForm, createInertiaApp } from "@inertiajs/vue3";
import { Editor, EditorContent } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import History from "@tiptap/extension-history";
import Placeholder from "@tiptap/extension-placeholder";
import axios from "axios";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$G = {
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const headerEl = ref(null);
    const mobileMenuEl = ref(null);
    const isMobileOpen = ref(false);
    const showMobile = ref(false);
    const isServicesOpen = ref(false);
    const isMegaOpen = ref(false);
    const menuTop = ref(80);
    const menuTopPx = computed(() => `${Math.max(0, Math.round(menuTop.value))}px`);
    function rafThrottle(fn) {
      let token = null;
      return (...args) => {
        if (token) return;
        token = requestAnimationFrame(() => {
          token = null;
          fn(...args);
        });
      };
    }
    const measureHeader = rafThrottle(() => {
      var _a;
      const r = (_a = headerEl.value) == null ? void 0 : _a.getBoundingClientRect();
      menuTop.value = ((r == null ? void 0 : r.bottom) ?? 64) + 8;
    });
    const page = usePage();
    const getProps = () => {
      var _a;
      return ((_a = page == null ? void 0 : page.props) == null ? void 0 : _a.value) ?? (page == null ? void 0 : page.props) ?? {};
    };
    const rawCats = computed(() => getProps().navServices ?? []);
    function normalizeCategories(arr) {
      return (Array.isArray(arr) ? arr : []).map((cat) => {
        const items = (Array.isArray(cat.items) ? cat.items : []).map((it) => {
          const slug = it.slug || String((it.href || "").split("/").pop() || "").trim();
          return { ...it, slug, href: it.href || `/sluzby/${slug}` };
        });
        return { ...cat, items };
      });
    }
    const prefOrder = ["servery", "kontejnery", "aplikace"];
    const orderIndex = (slug) => {
      const i = prefOrder.indexOf(String(slug || "").toLowerCase());
      return i === -1 ? 999 : i;
    };
    const categories = computed(() => {
      const base = normalizeCategories(rawCats.value);
      return [...base].sort((a, b) => orderIndex(a.slug) - orderIndex(b.slug));
    });
    const SVG_KEYS_INLINE = ["menu_icon_svg", "icon_svg", "svg", "icon"];
    const isSvgMarkup = (v) => typeof v === "string" && /^\s*<svg[\s>]/i.test(v);
    function svgForItem(it = {}) {
      for (const k of SVG_KEYS_INLINE) {
        const val = it == null ? void 0 : it[k];
        if (isSvgMarkup(val)) return val;
      }
      return "";
    }
    function closeMobile() {
      isMobileOpen.value = false;
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-open");
    }
    let onResize, onTransitionEnd, onDocClick, megaEl, ro;
    onMounted(() => {
      var _a;
      measureHeader();
      onResize = () => measureHeader();
      window.addEventListener("resize", onResize, { passive: true });
      onTransitionEnd = (e) => {
        if (e.target !== mobileMenuEl.value) return;
        if (!isMobileOpen.value) showMobile.value = false;
      };
      (_a = mobileMenuEl.value) == null ? void 0 : _a.addEventListener("transitionend", onTransitionEnd);
      megaEl = document.querySelector(".nav-item.mega");
      onDocClick = (e) => {
        if (megaEl && !megaEl.contains(e.target)) isMegaOpen.value = false;
      };
      document.addEventListener("click", onDocClick, { passive: true });
      if ("ResizeObserver" in window && headerEl.value) {
        ro = new ResizeObserver(() => measureHeader());
        ro.observe(headerEl.value);
      }
    });
    onBeforeUnmount(() => {
      var _a;
      window.removeEventListener("resize", onResize);
      (_a = mobileMenuEl.value) == null ? void 0 : _a.removeEventListener("transitionend", onTransitionEnd);
      document.removeEventListener("click", onDocClick);
      if (ro) ro.disconnect();
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-open");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: "site-header",
        role: "banner"
      }, _attrs))} data-v-7ef826d5><div class="navbar-shell" data-v-7ef826d5><nav class="navbar-inner" data-v-7ef826d5>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "brand",
        href: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", "/images/logo.png")} alt="ITGlobe logo" class="brand-logo" data-v-7ef826d5${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: "/images/logo.png",
                alt: "ITGlobe logo",
                class: "brand-logo"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<ul class="nav-list" data-v-7ef826d5><li class="nav-item" data-v-7ef826d5>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "nav-link",
        href: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Úvod`);
          } else {
            return [
              createTextVNode("Úvod")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item mega" data-v-7ef826d5><button class="nav-link mega-trigger" type="button" aria-haspopup="true"${ssrRenderAttr("aria-expanded", isMegaOpen.value)} data-v-7ef826d5> Služby <svg aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" class="caret" data-v-7ef826d5><path d="M5.5 7.5L10 12.5L14.5 7.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" data-v-7ef826d5></path></svg></button><div class="mega-panel" role="menu" aria-label="Služby" style="${ssrRenderStyle(isMegaOpen.value ? null : { display: "none" })}" data-v-7ef826d5>`);
      if (categories.value.length) {
        _push(`<div class="mega-grid" data-v-7ef826d5><!--[-->`);
        ssrRenderList(categories.value, (cat) => {
          _push(`<div class="mega-col" data-v-7ef826d5><div class="mega-title" data-v-7ef826d5>${ssrInterpolate(cat.name)}</div><ul class="mega-list" data-v-7ef826d5><!--[-->`);
          ssrRenderList(cat.items, (it) => {
            _push(`<li data-v-7ef826d5>`);
            _push(ssrRenderComponent(unref(Link), {
              class: "mega-item",
              href: it.href
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (svgForItem(it)) {
                    _push2(`<span class="ico" aria-hidden="true" data-v-7ef826d5${_scopeId}>${svgForItem(it) ?? ""}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<span data-v-7ef826d5${_scopeId}>${ssrInterpolate(it.title)}</span>`);
                } else {
                  return [
                    svgForItem(it) ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "ico",
                      innerHTML: svgForItem(it),
                      "aria-hidden": "true"
                    }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                    createVNode("span", null, toDisplayString(it.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="mega-empty" data-v-7ef826d5>Zatím žádné služby.</div>`);
      }
      _push(`</div></li><li class="nav-item" data-v-7ef826d5>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "nav-link",
        href: "/reference"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Reference`);
          } else {
            return [
              createTextVNode("Reference")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-7ef826d5>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "nav-link",
        href: "/o-nas"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`O nás`);
          } else {
            return [
              createTextVNode("O nás")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="nav-item" data-v-7ef826d5>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "nav-link",
        href: "/kontakt"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Kontakt`);
          } else {
            return [
              createTextVNode("Kontakt")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul><div class="nav-actions" data-v-7ef826d5>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "btn-cta",
        href: "/kontakt"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Kontaktujte nás`);
          } else {
            return [
              createTextVNode("Kontaktujte nás")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button class="hamburger" aria-label="Otevřít menu" aria-controls="navbar-mobile"${ssrRenderAttr("aria-expanded", isMobileOpen.value)} data-v-7ef826d5><svg class="ico-menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" aria-hidden="true" style="${ssrRenderStyle(!isMobileOpen.value ? null : { display: "none" })}" data-v-7ef826d5><path d="M4 5H20M4 12H20M4 19H20" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-7ef826d5></path></svg><svg class="ico-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" aria-hidden="true" style="${ssrRenderStyle(isMobileOpen.value ? null : { display: "none" })}" data-v-7ef826d5><path d="M18 6L6 18M6 6l12 12" stroke="#F52130" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-7ef826d5></path></svg></button></nav><div id="navbar-mobile" class="${ssrRenderClass([{ "is-open": isMobileOpen.value, "d-none": !showMobile.value }, "mobile-menu"])}" style="${ssrRenderStyle({ "--menu-top": menuTopPx.value })}" role="dialog" aria-modal="true" aria-labelledby="mm-title"${ssrRenderAttr("aria-hidden", (!isMobileOpen.value).toString())} data-v-7ef826d5><h2 id="mm-title" class="sr-only" data-v-7ef826d5>Menu</h2><nav class="mm-links" aria-label="Mobilní" data-v-7ef826d5>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "mm-link",
        href: "/",
        onClick: closeMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Úvod`);
          } else {
            return [
              createTextVNode("Úvod")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="mm-accordion"${ssrRenderAttr("aria-expanded", isServicesOpen.value)} aria-controls="mm-services-panel" data-v-7ef826d5><span data-v-7ef826d5>Služby</span><svg class="mm-caret" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true" data-v-7ef826d5><path d="M5.5 7.5L10 12.5L14.5 7.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-7ef826d5></path></svg></button><div id="mm-services-panel" class="${ssrRenderClass([{ "is-open": isServicesOpen.value }, "mm-panel"])}" style="${ssrRenderStyle(isServicesOpen.value ? null : { display: "none" })}" data-v-7ef826d5>`);
      if (categories.value.length) {
        _push(`<!--[-->`);
        ssrRenderList(categories.value, (cat) => {
          _push(`<!--[--><div class="mm-cat-title" data-v-7ef826d5>${ssrInterpolate(cat.name)}</div><!--[-->`);
          ssrRenderList(cat.items, (it) => {
            _push(ssrRenderComponent(unref(Link), {
              class: "mm-sub",
              key: it.slug,
              href: it.href,
              onClick: closeMobile
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (svgForItem(it)) {
                    _push2(`<span class="ico" aria-hidden="true" data-v-7ef826d5${_scopeId}>${svgForItem(it) ?? ""}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<span data-v-7ef826d5${_scopeId}>${ssrInterpolate(it.title)}</span>`);
                } else {
                  return [
                    svgForItem(it) ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "ico",
                      innerHTML: svgForItem(it),
                      "aria-hidden": "true"
                    }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                    createVNode("span", null, toDisplayString(it.title), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--><!--]-->`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<div class="mm-empty" data-v-7ef826d5>Zatím žádné služby.</div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "mm-link",
        href: "/reference",
        onClick: closeMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Reference`);
          } else {
            return [
              createTextVNode("Reference")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        class: "mm-link",
        href: "/o-nas",
        onClick: closeMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`O nás`);
          } else {
            return [
              createTextVNode("O nás")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        class: "mm-link",
        href: "/kontakt",
        onClick: closeMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Kontakt`);
          } else {
            return [
              createTextVNode("Kontakt")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "btn-cta mm-cta",
        href: "/kontakt",
        onClick: closeMobile
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Začít`);
          } else {
            return [
              createTextVNode("Začít")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></header>`);
    };
  }
};
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Header.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["__scopeId", "data-v-7ef826d5"]]);
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Header
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$F = {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const getProps = () => {
      var _a;
      return ((_a = page == null ? void 0 : page.props) == null ? void 0 : _a.value) ?? (page == null ? void 0 : page.props) ?? {};
    };
    const rawCats = computed(() => getProps().navServices ?? []);
    function normalizeCategories(arr) {
      return (Array.isArray(arr) ? arr : []).map((cat) => {
        const items = (Array.isArray(cat.items) ? cat.items : []).map((it) => {
          const slug = it.slug || String((it.href || "").split("/").pop() || "").trim();
          return {
            ...it,
            slug,
            href: it.href || `/sluzby/${slug}`
          };
        });
        return { ...cat, items };
      });
    }
    const categories = computed(() => normalizeCategories(rawCats.value));
    const wanted = ["servery", "kontejnery", "aplikace"];
    const cols = computed(() => {
      const cats = categories.value;
      const pick = (key) => cats.find((c) => [String(c.slug || ""), String(c.name || "")].map((s) => s.toLowerCase()).includes(key));
      return wanted.map((key) => {
        const cat = pick(key);
        const title = (cat == null ? void 0 : cat.name) ?? key[0].toUpperCase() + key.slice(1);
        return { key, title, items: (cat == null ? void 0 : cat.items) ?? [] };
      });
    });
    const mainLinks = [
      { label: "Úvod", href: "/" },
      { label: "Reference", href: "/reference" },
      { label: "O nás", href: "/o-nas" },
      { label: "Kontakt", href: "/kontakt" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({
        class: "site-footer text-white",
        role: "contentinfo"
      }, _attrs))}><div class="container"><div class="row g-3 align-items-start justify-content-center justify-content-md-between"><div class="col-lg-4 pe-lg-5">`);
      _push(ssrRenderComponent(unref(Link), {
        class: "d-inline-block mb-3",
        href: "/",
        "aria-label": "Domů"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="img-fluid footer-logo"${ssrRenderAttr("src", "/images/logo_footer.png")} alt="Logo společnosti" loading="lazy"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                class: "img-fluid footer-logo",
                src: "/images/logo_footer.png",
                alt: "Logo společnosti",
                loading: "lazy"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="footer-text mb-3"> Jsme odborníci na cloud a IT. Dodáváme spolehlivá řešení pro váš byznys s podporou 24/7. </p><nav class="footer-social mb-3" aria-label="Sociální sítě"><ul class="list-unstyled d-flex gap-2 mb-0"><li><a class="footer-social-link" href="https://facebook.com/yourpage" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i><span class="sr-only">Facebook</span></a></li><li><a class="footer-social-link" href="https://instagram.com/yourpage" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i><span class="sr-only">Instagram</span></a></li><li><a class="footer-social-link" href="https://linkedin.com/company/yourpage" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i><span class="sr-only">LinkedIn</span></a></li></ul></nav>`);
      _push(ssrRenderComponent(unref(Link), {
        class: "btn-cta",
        href: "/kontakt"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Kontaktujte nás`);
          } else {
            return [
              createTextVNode("Kontaktujte nás")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="col-6 col-md-3 col-lg-2"><div class="footer-col"><h5 class="footer-heading">Přehled</h5><ul class="list-unstyled d-flex flex-column gap-2 mb-0"><!--[-->`);
      ssrRenderList(mainLinks, (l) => {
        _push(`<li>`);
        _push(ssrRenderComponent(unref(Link), {
          class: "footer-link",
          href: l.href
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(l.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(l.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></div><!--[-->`);
      ssrRenderList(cols.value, (col) => {
        _push(`<div class="col-6 col-md-3 col-lg-2"><div class="footer-col"><h5 class="footer-heading">${ssrInterpolate(col.title)}</h5><ul class="list-unstyled d-flex flex-column gap-2 mb-0"><!--[-->`);
        ssrRenderList(col.items, (it) => {
          _push(`<li>`);
          _push(ssrRenderComponent(unref(Link), {
            class: "footer-link",
            href: it.href
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(it.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(it.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]-->`);
        if (!col.items.length) {
          _push(`<li class="text-muted small">Zatím žádné položky.</li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul></div></div>`);
      });
      _push(`<!--]--></div></div></footer>`);
    };
  }
};
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Footer.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$F
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$E = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-5 contact-action" }, _attrs))}><div class="container d-flex flex-column gap-2 text-center text-md-start"><div class="col-md-10 mx-auto text-center py-5 bg-cta-grad px-4 text-white rounded-4"><div class="opacity-75 mb-2">Přidejte se k těmto úspěšným značkám</div><div class="d-flex gap-2 justify-content-center mb-3 ref-badges" aria-label="Reference"><span class="logo-tile" role="img" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></span><span class="logo-tile" role="img" aria-label="Vercel"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false"><polygon points="12,3 22,21 2,21"></polygon></svg></span><span class="logo-tile" role="img" aria-label="Slack"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false"><rect x="2" y="7" width="20" height="3.5" rx="1.75"></rect><rect x="2" y="13.5" width="20" height="3.5" rx="1.75"></rect><rect x="7" y="2" width="3.5" height="20" rx="1.75"></rect><rect x="13.5" y="2" width="3.5" height="20" rx="1.75"></rect></svg></span><span class="logo-tile" role="img" aria-label="Spotify"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9.5"></circle><path d="M6.5 9.25c3.5-1.15 7.5-1.05 10.9.35" vector-effect="non-scaling-stroke"></path><path d="M7 12.2c2.8-.85 5.8-.75 8.4.25" vector-effect="non-scaling-stroke"></path><path d="M7.5 14.9c2.1-.65 4.2-.55 6 .25" vector-effect="non-scaling-stroke"></path></svg></span></div><h2 class="fs-1 fw-bold mb-1">Chcete posunout své IT dál?</h2><p class="opacity-75 mb-4">Kontaktujte nás a společně najdeme ideální řešení pro váš byznys.</p><div><a class="btn-cta" href="#quote">Kontaktujte nás</a></div></div></div></section>`);
}
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Cta.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const Cta = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["ssrRender", _sfc_ssrRender$3]]);
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Cta
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$D = {
  __name: "Hero",
  __ssrInlineRender: true,
  props: {
    hero: {
      type: Object,
      required: true,
      default: () => ({ title: "", subtitle: "", image: "" })
    },
    counters: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    function normalizeSrc(src) {
      if (!src) return "";
      const s = String(src).trim();
      if (/^(https?:)?\/\//i.test(s)) return s;
      if (/^data:/i.test(s)) return s;
      if (s.startsWith("/images/")) return s;
      return s;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "intro",
        class: "hero about-hero"
      }, _attrs))} data-v-2eae1fc2>`);
      if (__props.hero.image) {
        _push(`<img class="hero-bg"${ssrRenderAttr("src", normalizeSrc(__props.hero.image))}${ssrRenderAttr("alt", __props.hero.title || "Hero background")} aria-hidden="true" decoding="async" loading="eager" data-v-2eae1fc2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="overlay" data-v-2eae1fc2><div class="container text-center text-white" data-v-2eae1fc2><div class="mx-auto" data-v-2eae1fc2><h1 class="display-3 text-white fw-bold" data-v-2eae1fc2>${ssrInterpolate(__props.hero.title)}</h1>`);
      if (__props.hero.subtitle) {
        _push(`<p class="fs-5 mb-4" data-v-2eae1fc2>${ssrInterpolate(__props.hero.subtitle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.counters && __props.counters.length) {
        _push(`<div class="row g-4 justify-content-between text-start mt-5 about-hero__stats" data-v-2eae1fc2><!--[-->`);
        ssrRenderList(__props.counters, (c, i) => {
          _push(`<div class="col-12 col-md-4" data-v-2eae1fc2><div class="border-start border-3 border-primary ps-2" data-v-2eae1fc2><h2 class="mb-0" data-v-2eae1fc2>${ssrInterpolate(c.value)}</h2><p class="mb-0" data-v-2eae1fc2>${ssrInterpolate(c.label)}</p></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section>`);
    };
  }
};
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/About/Hero.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const AboutHero = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["__scopeId", "data-v-2eae1fc2"]]);
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AboutHero
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$C = {
  __name: "AboutUs",
  __ssrInlineRender: true,
  props: {
    about: {
      type: Object,
      required: true
      // { title, paragraphs: string[], image, imageAlt }
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "about",
        class: "about-us"
      }, _attrs))}><div class="container"><div class="row align-items-center g-4"><div class="col-12 col-lg-6"><h2 class="section-title">${ssrInterpolate(__props.about.title || "O nás")}</h2><!--[-->`);
      ssrRenderList(__props.about.paragraphs, (p, i) => {
        _push(`<p class="section-desc">${p ?? ""}</p>`);
      });
      _push(`<!--]--></div>`);
      if (__props.about.image) {
        _push(`<div class="col-12 col-lg-6"><figure class="m-0 about-us__media"><img${ssrRenderAttr("src", __props.about.image)}${ssrRenderAttr("alt", __props.about.imageAlt || __props.about.title || "O nás")} class="w-100 h-auto" loading="lazy"></figure></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section>`);
    };
  }
};
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/About/AboutUs.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$C
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$B = {
  __name: "Infrastructure",
  __ssrInlineRender: true,
  props: {
    infrastructure: {
      type: Object,
      default: () => ({
        lead: "",
        // blocks: [{ title, items:[{ badge,text } | { key,value }] }]
        blocks: []
      })
    }
  },
  setup(__props) {
    function asPair(it) {
      return [(it == null ? void 0 : it.badge) ?? (it == null ? void 0 : it.key) ?? "", (it == null ? void 0 : it.text) ?? (it == null ? void 0 : it.value) ?? ""];
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "infrastructure",
        class: "infrastructure about-infrastructure"
      }, _attrs))} data-v-07be8268><div class="container d-flex flex-column gap-2" data-v-07be8268><div class="col-md-7 mx-auto text-center mb-4" data-v-07be8268><h2 class="section-title" data-v-07be8268>Naše infrastruktura</h2><p class="section-desc" data-v-07be8268>${ssrInterpolate(__props.infrastructure.lead)}</p></div><div class="row g-2 row-cols-1 row-cols-sm-2 p-2 bg-secondary rounded-3" data-v-07be8268><!--[-->`);
      ssrRenderList((__props.infrastructure.blocks || []).slice(0, 2), (block, idx) => {
        _push(`<div class="col" data-v-07be8268><div class="bg-white h-100 rounded-3 p-4 d-flex flex-column infra-card" data-v-07be8268><div class="infra-icon" data-v-07be8268>`);
        if (idx === 0) {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" data-v-07be8268><g clip-path="url(#clip0_a)" data-v-07be8268><path d="M4 9.33337C4 8.27251 4.42143 7.25509 5.17157 6.50495C5.92172 5.7548 6.93913 5.33337 8 5.33337H24C25.0609 5.33337 26.0783 5.7548 26.8284 6.50495C27.5786 7.25509 28 8.27251 28 9.33337V12C28 13.0609 27.5786 14.0783 26.8284 14.8285C26.0783 15.5786 25.0609 16 24 16H8C6.93913 16 5.92172 15.5786 5.17157 14.8285C4.42143 14.0783 4 13.0609 4 12V9.33337Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07be8268></path><path d="M4 20C4 18.9391 4.42143 17.9217 5.17157 17.1716C5.92172 16.4214 6.93913 16 8 16H24C25.0609 16 26.0783 16.4214 26.8284 17.1716C27.5786 17.9217 28 18.9391 28 20V22.6667C28 23.7275 27.5786 24.7449 26.8284 25.4951C26.0783 26.2452 25.0609 26.6667 24 26.6667H8C6.93913 26.6667 5.92172 26.2452 5.17157 25.4951C4.42143 24.7449 4 23.7275 4 22.6667V20Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07be8268></path><path d="M9.33325 10.6666V10.68" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07be8268></path><path d="M9.33325 21.3334V21.3467" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07be8268></path></g><defs data-v-07be8268><clipPath id="clip0_a" data-v-07be8268><rect width="32" height="32" fill="white" data-v-07be8268></rect></clipPath></defs></svg>`);
        } else {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" data-v-07be8268><g clip-path="url(#clip0_b)" data-v-07be8268><path d="M8.87584 21.3333C5.4465 21.3333 2.6665 18.6573 2.6665 15.356C2.6665 12.056 5.4465 9.37997 8.87584 9.37997C9.39984 7.03063 11.2678 5.1133 13.7758 4.3493C16.2825 3.58663 19.0505 4.09197 21.0345 5.68263C23.0185 7.2693 23.9172 9.69197 23.3945 12.0413H24.7145C27.2652 12.0413 29.3332 14.1213 29.3332 16.6893C29.3332 19.2586 27.2652 21.3386 24.7132 21.3386H8.87584" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07be8268></path><path d="M16 21.3334V28" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07be8268></path><path d="M21.3335 21.3334V26.6667C21.3335 27.0203 21.474 27.3595 21.724 27.6095C21.9741 27.8596 22.3132 28 22.6668 28H28.0002" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07be8268></path><path d="M10.6667 21.3334V26.6667C10.6667 27.0203 10.5262 27.3595 10.2761 27.6095C10.0261 27.8596 9.68695 28 9.33333 28H4" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07be8268></path></g><defs data-v-07be8268><clipPath id="clip0_b" data-v-07be8268><rect width="32" height="32" fill="white" data-v-07be8268></rect></clipPath></defs></svg>`);
        }
        _push(`</div><h3 class="fw-bold mb-0" data-v-07be8268>${ssrInterpolate(block.title)}</h3><ul class="list-unstyled mb-0 mt-3" data-v-07be8268><!--[-->`);
        ssrRenderList(block.items || [], (it, ii) => {
          _push(`<li class="infra-item" data-v-07be8268><span class="badge rounded-pill infra-badge" data-v-07be8268><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" data-v-07be8268><g clip-path="url(#c0)" data-v-07be8268><path d="M10 1.333L10.359 2.928C10.664 4.28 11.72 5.336 13.072 5.641L14.667 6L13.072 6.359C11.72 6.664 10.664 7.72 10.359 9.072L10 10.667L9.641 9.072C9.336 7.72 8.28 6.664 6.928 6.359L5.333 6L6.928 5.641C8.28 5.336 9.336 4.28 9.641 2.928L10 1.333Z" stroke="#717680" stroke-width="1.5" stroke-linejoin="round" data-v-07be8268></path><path d="M4.667 8L4.923 9.139C5.141 10.105 5.895 10.859 6.861 11.077L8 11.333L6.861 11.59C5.895 11.807 5.141 12.562 4.923 13.528L4.667 14.667L4.41 13.528C4.192 12.562 3.438 11.807 2.472 11.59L1.333 11.333L2.472 11.077C3.438 10.859 4.192 10.105 4.41 9.139L4.667 8Z" stroke="#717680" stroke-width="1.5" stroke-linejoin="round" data-v-07be8268></path></g><defs data-v-07be8268><clipPath id="c0" data-v-07be8268><rect width="16" height="16" fill="white" data-v-07be8268></rect></clipPath></defs></svg> ${ssrInterpolate(asPair(it)[0])}</span><span class="infra-text" data-v-07be8268>${ssrInterpolate(asPair(it)[1])}</span></li>`);
        });
        _push(`<!--]--></ul></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
};
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/About/Infrastructure.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const Infrastructure = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["__scopeId", "data-v-07be8268"]]);
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Infrastructure
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$A = {
  __name: "OurTeam",
  __ssrInlineRender: true,
  props: {
    gallery: {
      type: Array,
      default: () => []
      // [{ title, alt, src }]
    }
  },
  setup(__props) {
    const props = __props;
    const img = (idx, fallback) => {
      var _a, _b;
      return ((_b = (_a = props.gallery) == null ? void 0 : _a[idx]) == null ? void 0 : _b.src) || fallback;
    };
    const alt = (idx, fallback) => {
      var _a, _b;
      return ((_b = (_a = props.gallery) == null ? void 0 : _a[idx]) == null ? void 0 : _b.alt) || fallback;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "d-none d-md-block text-center our-team" }, _attrs))} data-v-bccfd188><div class="container" data-v-bccfd188><div class="row g-3 align-items-stretch" data-v-bccfd188><div class="col-md-4 pb-0" data-v-bccfd188><div class="rounded-3 overflow-hidden h-100 our-team__left" data-v-bccfd188><img${ssrRenderAttr("src", img(0, "/images/about/about_gallery1.jpg"))}${ssrRenderAttr("alt", alt(0, "O nás – obrázek 1"))} class="w-100 h-100 object-fit-cover" loading="lazy" data-v-bccfd188></div></div><div class="col" data-v-bccfd188><div class="row g-3 row-cols-1 row-cols-sm-2 align-items-stretch our-team__grid" data-v-bccfd188><div class="col" data-v-bccfd188><div class="bg-primary p-5 d-flex justify-content-center align-items-center rounded-3 overflow-hidden our-team__tile" data-v-bccfd188><div data-v-bccfd188><div class="emoji" role="img" aria-label="Usměvavá tvář" data-v-bccfd188><span class="emoji__mouth" data-v-bccfd188></span></div><p class="fw-bold fs-2 text-white mb-0" data-v-bccfd188> Odhodlaný<br data-v-bccfd188> tým profesionálů </p></div></div></div><div class="col" data-v-bccfd188><div class="rounded-3 overflow-hidden our-team__tile" data-v-bccfd188><img${ssrRenderAttr("src", img(1, "/images/about/about_gallery2.jpg"))}${ssrRenderAttr("alt", alt(1, "O nás – obrázek 2"))} class="w-100 h-100 object-fit-cover" loading="lazy" data-v-bccfd188></div></div><div class="col" data-v-bccfd188><div class="rounded-3 overflow-hidden our-team__tile" data-v-bccfd188><img${ssrRenderAttr("src", img(2, "/images/about/about_gallery3.jpg"))}${ssrRenderAttr("alt", alt(2, "O nás – obrázek 3"))} class="w-100 h-100 object-fit-cover" loading="lazy" data-v-bccfd188></div></div><div class="col" data-v-bccfd188><div class="rounded-3 overflow-hidden our-team__tile" data-v-bccfd188><img${ssrRenderAttr("src", img(3, "/images/home/services_kubernetes.jpg"))}${ssrRenderAttr("alt", alt(3, "O nás – obrázek 4"))} class="w-100 h-100 object-fit-cover" loading="lazy" data-v-bccfd188></div></div></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/About/OurTeam.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const OurTeam = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["__scopeId", "data-v-bccfd188"]]);
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OurTeam
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$z = {
  __name: "About",
  __ssrInlineRender: true,
  props: {
    page: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const data = computed(() => {
      var _a;
      return ((_a = props.page) == null ? void 0 : _a.data) || {};
    });
    const hero = computed(() => {
      var _a, _b, _c, _d, _e, _f;
      return {
        title: ((_b = (_a = data.value) == null ? void 0 : _a.hero) == null ? void 0 : _b.title) ?? "",
        subtitle: ((_d = (_c = data.value) == null ? void 0 : _c.hero) == null ? void 0 : _d.subtitle) ?? "",
        image: ((_f = (_e = data.value) == null ? void 0 : _e.hero) == null ? void 0 : _f.image) ?? null
      };
    });
    const counters = computed(
      () => {
        var _a;
        return Array.isArray((_a = data.value) == null ? void 0 : _a.counters) ? data.value.counters : [];
      }
    );
    function splitParas(t = "") {
      return t.split(/\n{2,}/).map((p) => p.replaceAll("\n", "<br>")).filter((p) => p.trim());
    }
    const about = computed(() => {
      var _a;
      const a = ((_a = data.value) == null ? void 0 : _a.about) || {};
      const img = a.image || {};
      return {
        title: a.title ?? "O nás",
        paragraphs: splitParas(a.text || ""),
        image: img.src ?? "",
        imageAlt: img.alt ?? ""
      };
    });
    const infrastructure = computed(() => {
      var _a, _b, _c, _d;
      return {
        lead: ((_b = (_a = data.value) == null ? void 0 : _a.infrastructure) == null ? void 0 : _b.lead) ?? "",
        blocks: ((_d = (_c = data.value) == null ? void 0 : _c.infrastructure) == null ? void 0 : _d.blocks) ?? []
      };
    });
    const gallery = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.gallery) ?? [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: __props.page.title || "O nás | IT Globe s.r.o."
      }, null, _parent));
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main>`);
      _push(ssrRenderComponent(AboutHero, {
        hero: hero.value,
        counters: counters.value
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$C, { about: about.value }, null, _parent));
      _push(ssrRenderComponent(Infrastructure, { infrastructure: infrastructure.value }, null, _parent));
      _push(ssrRenderComponent(OurTeam, { gallery: gallery.value }, null, _parent));
      _push(ssrRenderComponent(Cta, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$F, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/About.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$z
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$y = {
  __name: "AdminSidebar",
  __ssrInlineRender: true,
  props: {
    // 'dashboard' | 'add' | 'edit' | 'about' | 'contact' | 'profile'
    active: { type: String, default: "dashboard" }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const isReferences = computed(
      () => typeof window !== "undefined" && window.location.pathname.startsWith("/admin/references")
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({
        class: "admin-sidebar",
        "aria-label": "Sidebar"
      }, _attrs))} data-v-e5d52c5c><div class="brand" data-v-e5d52c5c><i class="fa-solid fa-layer-group" data-v-e5d52c5c></i><span class="brand-name" data-v-e5d52c5c>Admin</span></div><nav class="menu" aria-label="Main menu" data-v-e5d52c5c><div class="menu-section" data-v-e5d52c5c><a href="#" class="${ssrRenderClass([{ active: __props.active === "dashboard" }, "menu-item"])}" data-v-e5d52c5c><i class="fa-solid fa-gauge-high" data-v-e5d52c5c></i><span data-v-e5d52c5c>Dashboard</span></a></div><div class="menu-label" data-v-e5d52c5c>Stránky</div><div class="menu-section" data-v-e5d52c5c><a href="#" class="${ssrRenderClass([{ active: __props.active === "add" }, "menu-item"])}" data-v-e5d52c5c><i class="fa-solid fa-plus" data-v-e5d52c5c></i><span data-v-e5d52c5c>Přidat stránku</span></a><a href="#" class="${ssrRenderClass([{ active: __props.active === "edit" }, "menu-item"])}" data-v-e5d52c5c><i class="fa-regular fa-pen-to-square" data-v-e5d52c5c></i><span data-v-e5d52c5c>Upravit stránky</span></a></div><div class="menu-label" data-v-e5d52c5c>Reference</div><div class="menu-section" data-v-e5d52c5c><a href="/admin/references" class="${ssrRenderClass([{ active: isReferences.value }, "menu-item"])}" data-v-e5d52c5c><i class="fa-regular fa-handshake" data-v-e5d52c5c></i><span data-v-e5d52c5c>Reference</span></a></div><div class="menu-label" data-v-e5d52c5c>Statické</div><div class="menu-section" data-v-e5d52c5c><a href="#" class="${ssrRenderClass([{ active: __props.active === "about" }, "menu-item"])}" data-v-e5d52c5c><i class="fa-regular fa-id-card" data-v-e5d52c5c></i><span data-v-e5d52c5c>O nás</span></a><a href="#" class="${ssrRenderClass([{ active: __props.active === "contact" }, "menu-item"])}" data-v-e5d52c5c><i class="fa-regular fa-envelope" data-v-e5d52c5c></i><span data-v-e5d52c5c>Kontakt</span></a></div><div class="menu-label" data-v-e5d52c5c>Účet</div><div class="menu-section" data-v-e5d52c5c><a href="#" class="${ssrRenderClass([{ active: __props.active === "profile" }, "menu-item"])}" data-v-e5d52c5c><i class="fa-solid fa-user-gear" data-v-e5d52c5c></i><span data-v-e5d52c5c>Upravit profil</span></a></div></nav><button type="button" class="menu-item logout" data-v-e5d52c5c><i class="fa-solid fa-right-from-bracket" data-v-e5d52c5c></i><span data-v-e5d52c5c>Odhlásit</span></button></aside>`);
    };
  }
};
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/AdminSidebar.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const AdminSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["__scopeId", "data-v-e5d52c5c"]]);
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminSidebar
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$x = {
  __name: "ReferencesTable",
  __ssrInlineRender: true,
  props: {
    items: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const rows = computed(
      () => (props.items || []).map((r) => ({
        id: r.id,
        title: r.title || "",
        tag: r.tag || "",
        logo: r.logo || ""
      }))
    );
    const deleting = ref(/* @__PURE__ */ new Set());
    const isDeleting = (id) => deleting.value.has(id);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card-wrap" }, _attrs))} data-v-82ed718b><div class="card-head" data-v-82ed718b><h3 class="title" data-v-82ed718b>Seznam referencí</h3><div class="muted" data-v-82ed718b><strong data-v-82ed718b>${ssrInterpolate(rows.value.length)}</strong> položek</div></div><div class="table-responsive" data-v-82ed718b><table class="table align-middle" data-v-82ed718b><thead data-v-82ed718b><tr data-v-82ed718b><th style="${ssrRenderStyle({ "width": "84px" })}" data-v-82ed718b>Logo</th><th data-v-82ed718b>Název</th><th data-v-82ed718b>Štítek</th><th style="${ssrRenderStyle({ "width": "180px" })}" data-v-82ed718b>Akce</th></tr></thead><tbody data-v-82ed718b><!--[-->`);
      ssrRenderList(rows.value, (r) => {
        _push(`<tr data-v-82ed718b><td data-v-82ed718b>`);
        if (r.logo) {
          _push(`<img${ssrRenderAttr("src", r.logo)} alt="" class="thumb" data-v-82ed718b>`);
        } else {
          _push(`<span class="text-muted" data-v-82ed718b>—</span>`);
        }
        _push(`</td><td class="fw-800" data-v-82ed718b>${ssrInterpolate(r.title)}</td><td data-v-82ed718b>${ssrInterpolate(r.tag || "—")}</td><td data-v-82ed718b><div class="actions" data-v-82ed718b>`);
        _push(ssrRenderComponent(unref(Link), {
          class: "btn-ghost",
          href: `/admin/references/${r.id}/edit`,
          "preserve-scroll": "",
          title: "Upravit"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fa-regular fa-pen-to-square" data-v-82ed718b${_scopeId}></i>`);
            } else {
              return [
                createVNode("i", { class: "fa-regular fa-pen-to-square" })
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<button class="btn-ghost danger"${ssrIncludeBooleanAttr(isDeleting(r.id)) ? " disabled" : ""} title="Smazat" data-v-82ed718b><i class="fa-regular fa-trash-can" data-v-82ed718b></i></button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (rows.value.length === 0) {
        _push(`<tr data-v-82ed718b><td colspan="4" class="text-center text-muted py-4" data-v-82ed718b>Zatím žádné reference.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div>`);
    };
  }
};
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/ReferencesTable.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const ReferencesTable = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["__scopeId", "data-v-82ed718b"]]);
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ReferencesTable
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$w = {
  __name: "DropzoneImage",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    accept: { type: String, default: "image/*" },
    height: { type: [Number, String], default: 360 },
    placeholder: { type: String, default: "Přetáhni sem obrázek nebo vyber soubor" },
    // ⬇️ odstraněny doporučené rozměry
    hint: { type: String, default: "PNG/JPG/WEBP." },
    previewW: { type: Number, default: 400 },
    previewH: { type: Number, default: 240 },
    previewRatio: { type: [String, Number], default: "16 / 9" },
    objectFit: { type: String, default: "cover" }
  }, {
    "file": { default: null },
    "fileModifiers": {},
    "url": { default: "" },
    "urlModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["change"], ["update:file", "update:url"]),
  setup(__props, { emit: __emit }) {
    const file = useModel(__props, "file");
    const url = useModel(__props, "url");
    const props = __props;
    const isOver = ref(false);
    ref(null);
    const blobOwned = ref(false);
    const thumbStyle = computed(() => ({
      maxWidth: props.previewW + "px",
      maxHeight: props.previewH + "px",
      aspectRatio: String(props.previewRatio)
    }));
    const imgStyle = computed(() => ({ objectFit: props.objectFit }));
    function revokeIfOwned() {
      if (url.value && blobOwned.value && url.value.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(url.value);
        } catch {
        }
      }
    }
    function setPreviewFromFile(f) {
      var _a, _b;
      if (!f || !((_b = (_a = f.type) == null ? void 0 : _a.startsWith) == null ? void 0 : _b.call(_a, "image/"))) return;
      revokeIfOwned();
      url.value = URL.createObjectURL(f);
      blobOwned.value = true;
    }
    onMounted(() => {
      if (file.value instanceof File) setPreviewFromFile(file.value);
    });
    watch(file, (f) => {
      if (f instanceof File) {
        setPreviewFromFile(f);
      } else if (!f) {
        revokeIfOwned();
        url.value = "";
        blobOwned.value = false;
      }
    });
    onBeforeUnmount(() => {
      revokeIfOwned();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["dropzone", { over: isOver.value }],
        role: "button",
        tabindex: "0"
      }, _attrs))} data-v-693742e3>`);
      if (!url.value) {
        _push(`<div class="dz-inner" data-v-693742e3><i class="fa-solid fa-image dz-ico" data-v-693742e3></i><p class="dz-title" data-v-693742e3>${ssrInterpolate(__props.placeholder)}</p>`);
        if (__props.hint) {
          _push(`<p class="dz-hint" data-v-693742e3>${ssrInterpolate(__props.hint)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="dz-preview" data-v-693742e3><div class="thumb" style="${ssrRenderStyle(thumbStyle.value)}" data-v-693742e3><img${ssrRenderAttr("src", url.value)} alt="Náhled" class="thumb-img clickable" style="${ssrRenderStyle(imgStyle.value)}" data-v-693742e3></div><div class="dz-actions" data-v-693742e3><button class="btn btn-primary btn-sm" data-v-693742e3>Nahradit…</button></div></div>`);
      }
      _push(`<input type="file" class="sr-only"${ssrRenderAttr("accept", props.accept)} data-v-693742e3></div>`);
    };
  }
};
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/DropzoneImage.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const DropzoneImage = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["__scopeId", "data-v-693742e3"]]);
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DropzoneImage
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$v = {
  __name: "ReferenceForm",
  __ssrInlineRender: true,
  props: {
    mode: { type: String, default: "create" },
    // 'create' | 'edit'
    initial: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    var _a, _b, _c, _d, _e;
    const props = __props;
    const form = reactive({
      id: ((_a = props.initial) == null ? void 0 : _a.id) ?? null,
      title: ((_b = props.initial) == null ? void 0 : _b.title) ?? "",
      description: ((_c = props.initial) == null ? void 0 : _c.description) ?? "",
      tag: ((_d = props.initial) == null ? void 0 : _d.tag) ?? "",
      // pro náhled: u editace předvyplníme existující logo
      logoUrl: ((_e = props.initial) == null ? void 0 : _e.logo) ?? null,
      logoFile: null
      // nový soubor (přehraje staré)
    });
    const canSave = computed(
      () => (form.title || "").trim().length > 0 && (form.description || "").trim().length > 0
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card-wrap" }, _attrs))} data-v-0783800f><h3 class="title" data-v-0783800f>${ssrInterpolate(props.mode === "edit" ? "Upravit referenci" : "Přidat referenci")}</h3><div class="grid two" data-v-0783800f><div class="mb-2" data-v-0783800f><label class="form-label" data-v-0783800f>Název</label><input class="form-control"${ssrRenderAttr("value", form.title)} placeholder="E-shop v cloudu" data-v-0783800f></div><div class="mb-2" data-v-0783800f><label class="form-label" data-v-0783800f>Štítek (tag)</label><input class="form-control"${ssrRenderAttr("value", form.tag)} placeholder="VPS + vyvažování zátěže" data-v-0783800f></div></div><div class="mb-2" data-v-0783800f><label class="form-label" data-v-0783800f>Popis</label><textarea class="form-control" rows="5" placeholder="Krátký popis řešení…" data-v-0783800f>${ssrInterpolate(form.description)}</textarea></div><div class="mb-2" data-v-0783800f><label class="form-label" data-v-0783800f>Logo (náhled + nahrání)</label>`);
      _push(ssrRenderComponent(DropzoneImage, {
        file: form.logoFile,
        "onUpdate:file": ($event) => form.logoFile = $event,
        url: form.logoUrl,
        "onUpdate:url": ($event) => form.logoUrl = $event,
        "preview-w": 260,
        "preview-h": 120,
        "preview-ratio": "13 / 6",
        "object-fit": "contain",
        placeholder: "Přetáhni nebo vyber logo",
        hint: "PNG/JPG/WEBP/SVG. Nový soubor automaticky nahradí stávající logo."
      }, null, _parent));
      _push(`</div><div class="actions" data-v-0783800f><button class="btn btn-primary"${ssrIncludeBooleanAttr(!canSave.value) ? " disabled" : ""} data-v-0783800f>${ssrInterpolate(props.mode === "edit" ? "Uložit změny" : "Uložit")}</button></div></div>`);
    };
  }
};
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/ReferenceForm.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const ReferenceForm = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-0783800f"]]);
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ReferenceForm
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$u = {
  __name: "AdminReferences",
  __ssrInlineRender: true,
  props: {
    references: { type: Array, default: () => [] },
    reference: { type: Object, default: null }
  },
  setup(__props) {
    const page = usePage();
    const view = computed(() => {
      const url = page.url || "";
      if (url.includes("/create")) return "create";
      if (url.includes("/edit")) return "edit";
      return "list";
    });
    function onSidebarSelect(v) {
      router.visit(`/admin?view=${v}`, { replace: true, preserveScroll: true });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Admin — Reference" }, null, _parent));
      _push(`<div class="admin-shell" data-v-fb566fc1><div class="admin-main" data-v-fb566fc1>`);
      _push(ssrRenderComponent(AdminSidebar, {
        active: "references",
        onSelect: onSidebarSelect
      }, null, _parent));
      _push(`<main class="admin-content" data-v-fb566fc1><div class="container-fluid py-4" data-v-fb566fc1><div class="d-flex align-items-center justify-content-between gap-2 mb-3" data-v-fb566fc1><h1 class="page-title" data-v-fb566fc1>Reference</h1>`);
      if (view.value === "list") {
        _push(`<div class="d-flex gap-2" data-v-fb566fc1>`);
        _push(ssrRenderComponent(unref(Link), {
          class: "btn btn-primary btn-sm",
          href: "/admin/references/create"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Přidat referenci`);
            } else {
              return [
                createTextVNode("Přidat referenci")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="d-flex gap-2" data-v-fb566fc1><button class="btn btn-light border btn-sm" data-v-fb566fc1>← Zpět na seznam</button></div>`);
      }
      _push(`</div>`);
      if (view.value === "list") {
        _push(`<section data-v-fb566fc1>`);
        _push(ssrRenderComponent(ReferencesTable, { items: __props.references }, null, _parent));
        _push(`</section>`);
      } else if (view.value === "create") {
        _push(`<section data-v-fb566fc1>`);
        _push(ssrRenderComponent(ReferenceForm, { mode: "create" }, null, _parent));
        _push(`</section>`);
      } else if (view.value === "edit") {
        _push(`<section data-v-fb566fc1>`);
        _push(ssrRenderComponent(ReferenceForm, {
          mode: "edit",
          initial: __props.reference
        }, null, _parent));
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></main></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/AdminReferences.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const AdminReferences = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["__scopeId", "data-v-fb566fc1"]]);
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminReferences
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$t = {
  __name: "FeaturesEditor",
  __ssrInlineRender: true,
  props: {
    "modelValue": { type: Array, default: () => [] },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const items = useModel(__props, "modelValue");
    const ICON_SVGS = {
      bolt: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 1.75 4.5 10.25h4l-1 8 6-8h-4l1-6.5z"/></svg>`,
      shield: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M10 18c4.5-2 7-4.5 7-9.5V4.7c0-.4-.3-.7-.7-.8C13.7 3.4 12 2.9 10 2 8 2.9 6.3 3.4 3.7 3.9c-.4.1-.7.4-.7.8V8.5C3 13.5 5.5 16 10 18z"/></svg>`,
      server: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="3" width="14" height="5" rx="1.2"/><rect x="3" y="12" width="14" height="5" rx="1.2"/><circle cx="6" cy="5.5" r="0.9" fill="currentColor"/><circle cx="6" cy="14.5" r="0.9" fill="currentColor"/></svg>`,
      code: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 6.5 4 10l3.5 3.5M12.5 6.5 16 10l-3.5 3.5"/></svg>`,
      app: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1.2"/><rect x="11" y="3" width="6" height="6" rx="1.2"/><rect x="3" y="11" width="6" height="6" rx="1.2"/><rect x="11" y="11" width="6" height="6" rx="1.2"/></svg>`,
      scale: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3v14M3 6h14"/><path d="M6 6l-3 6h6l-3-6zM14 6l-3 6h6l-3-6z"/></svg>`,
      k8s: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2.2 15.5 5v10L10 17.8 4.5 15V5L10 2.2z"/><path d="M10 5v10M5.8 7.5l8.4 5M14.2 7.5l-8.4 5"/></svg>`,
      pipeline: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="4.5" cy="10" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="15.5" cy="10" r="1.7"/><path d="M6.2 10h2.1M11.7 10h2.1"/></svg>`,
      move: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="5" height="9" rx="1.2"/><rect x="12.5" y="5.5" width="5" height="9" rx="1.2"/><path d="M6.5 8H14.5"/><path d="M14.5 8l-2-2M14.5 8l-2 2"/><path d="M14.5 12H6.5"/><path d="M6.5 12l2-2M6.5 12l2 2"/></svg>`,
      rocket: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 11c1.7-1.7 2.7-5.4 2.4-7.3-1.9-.3-5.6.7-7.3 2.4L5 8l7 7 1.9-2.1z"/><path d="M7.5 12.5 5 15l2.5.5.5 2.5 2.5-2.5"/><circle cx="11.5" cy="8.5" r="1.2"/></svg>`,
      check: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5 8.2 14l7.3-8"/></svg>`,
      lock: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="4" y="8" width="12" height="9" rx="1.8"/><path d="M7 8V6.8A3.2 3.2 0 0 1 10.2 3.6h-.4A3.2 3.2 0 0 1 13 6.8V8"/></svg>`,
      speed: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.5a6 6 0 1 1 12 0"/><path d="M10 14.5l3.6-4.1"/><circle cx="10" cy="14.5" r="1.2"/></svg>`,
      star: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m10 2.8 2 4 4.4.6-3.2 3.1.8 4.4L10 13.6 6 15l.8-4.4L3.6 7.4 8 6.8l2-4z"/></svg>`,
      cloud: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 15.5h7.5a3.5 3.5 0 1 0-.6-6.9 4.5 4.5 0 0 0-8.8 1.4A3.2 3.2 0 0 0 6.5 15.5z"/></svg>`,
      database: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><ellipse cx="10" cy="4.5" rx="6.5" ry="2.5"/><path d="M3.5 4.5v5c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-5"/><path d="M3.5 9.5v5c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-5"/></svg>`,
      clock: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.2"/><path d="M10 5.6V10l3 2"/></svg>`,
      firewall: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="14" height="12" rx="1.8"/><path d="M6 8h8M6 12h5"/></svg>`,
      backup: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3a7 7 0 1 0 7 7"/><path d="M10 3v3m0-3 3 3"/></svg>`,
      support: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8.5a5 5 0 0 1 10 0v4"/><rect x="2.8" y="8" width="3.4" height="5.5" rx="1.2"/><rect x="13.8" y="8" width="3.4" height="5.5" rx="1.2"/><path d="M7.5 15.5h5"/></svg>`,
      euro: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15.6 5.8A6 6 0 1 0 14 16.2"/><path d="M4.5 8h7M4.5 12h7"/></svg>`,
      chip: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="10" height="10" rx="2"/><path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3M4 4l2 2M14 4l2 2M4 16l2-2M16 16l-2-2"/></svg>`,
      globe: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.2"/><path d="M2.8 10h14.4M10 2.8a12 12 0 0 1 0 14.4M10 2.8a12 12 0 0 0 0 14.4"/></svg>`,
      eyeOff: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l14 14"/><path d="M16.2 12.8A10.6 10.6 0 0 0 18.5 10 10.6 10.6 0 0 0 10 5c-1.9 0-3.6.5-5.1 1.4M7.8 7.8A3 3 0 0 1 12.2 12.2"/><circle cx="10" cy="10" r="2.8"/></svg>`,
      gear: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="2.5"/><path d="M10 2.8v2.2M10 15v2.2M2.8 10H5M15 10h2.2M4.4 4.4l1.6 1.6M14 14l1.6 1.6M15.6 4.4 14 6M6 14l-1.6 1.6"/></svg>`,
      docker: `<svg viewBox="0 0 24 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="3" height="3" rx="0.6"/><rect x="7" y="7" width="3" height="3" rx="0.6"/><rect x="11" y="7" width="3" height="3" rx="0.6"/><rect x="7" y="3" width="3" height="3" rx="0.6"/><rect x="11" y="3" width="3" height="3" rx="0.6"/><rect x="15" y="7" width="3" height="3" rx="0.6"/><path d="M3 12.5c0 3 2.4 4.5 6.5 4.5H16c4 0 5.5-1.9 5.5-4.5-.7.2-1.5.1-2.2-.2-.9-.3-1.7-1.1-2.1-2-1 .9-2.3 1.4-3.6 1.4H8"/></svg>`,
      /* === Nové ikony === */
      eco: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none"><path d="M6.666 5.834h7.292c1.756 0 2.634 0 3.264.422.273.182.508.417.691.69.404.606.42 1.439.421 3.057v.834M10 5.834 9.472 4.778C9.035 3.903 8.635 3.023 7.666 2.659 7.241 2.5 6.757 2.5 5.787 2.5 4.273 2.5 3.516 2.5 2.948 2.817c-.405.226-.739.56-.965.965-.317.568-.317 1.325-.317 2.84v2.547c0 3.929 0 5.894 1.22 7.115 1.034 1.034 2.602 1.192 5.446 1.216" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10.834 15.556c0 1.073.84 1.944 1.875 1.944h3.938c.932 0 1.688-.783 1.688-1.75S18.57 14 17.638 14c.104-1.196-.821-2.333-2.054-2.333-1.079 0-1.964.859-2.054 1.953-.951.094-1.695.925-1.695 1.936Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      compress: `<svg viewBox="0 0 20 20" width="20" height="20" fill="none"><path d="M13.657 2.5l.836.813c.373.363.56.545.494.699-.066.154-.33.154-.858.154H7.662C4.351 4.166 1.667 6.778 1.667 10c0 1.239.397 2.388 1.074 3.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.343 17.5l-.836-.813c-.373-.363-.559-.545-.493-.699.065-.154.329-.154.857-.154h6.467C15.649 15.833 18.333 13.222 18.333 10c0-1.239-.397-2.388-1.074-3.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.5 10h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      badgeCheck: `<svg viewBox="0 0 21 20" width="20" height="20" fill="none"><path d="M14.833 12.083c0 3.451-2.798 6.25-6.25 6.25s-6.25-2.799-6.25-6.25 2.798-6.25 6.25-6.25 6.25 2.799 6.25 6.25Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6.5 10.833 12.75 4.583M15.667 1.667 14.417 2.917M19 5l-2.5 2.5M9.833 13.333l2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      users: `<svg viewBox="0 0 21 20" width="20" height="20" fill="none"><path d="M19 6.07c0 2.202-1.866 3.987-4.167 3.987-.27 0-.54-.025-.806-.074-.191-.036-.287-.054-.354-.044-.066.01-.161.06-.35.16-.535.284-1.159.385-1.759.273.228-.28.384-.617.452-.978.042-.221-.061-.435-.216-.592a3.75 3.75 0 0 1-1.133-2.732C10.667 3.868 12.532 2.083 14.833 2.083 17.134 2.083 19 3.868 19 6.07Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13.577 6.25h.007M16.077 6.25h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6.918 17.917H4.598c-.27 0-.54-.038-.787-.145-.806-.346-1.214-.803-1.405-1.089a.5.5 0 0 1 .023-.526c.934-1.24 3.101-1.988 4.492-1.988 1.39 0 3.554.749 4.487 1.988a.5.5 0 0 1 .025.526c-.19.286-.6.743-1.405 1.089-.247.107-.517.145-.786.145H6.918Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.238 9.824c0 1.276-1.037 2.311-2.316 2.311-1.279 0-2.316-1.035-2.316-2.311 0-1.276 1.037-2.31 2.316-2.31 1.279 0 2.316 1.034 2.316 2.31Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      headsetAlt: `<svg viewBox="0 0 21 20" width="20" height="20" fill="none"><path d="M6.167 1.667C3.865 1.667 2 3.532 2 5.833c0 1.542.838 2.889 2.083 3.61v5.426c0 .681 0 1.022.127 1.328.127.306.368.547.85 1.029L6.167 18.333l1.757-1.757a.86.86 0 0 0 .164-.565c0-.093 0-.15 0-.265 0-.093 0-.139-.005-.184a.8.8 0 0 0-.218-.485L7 13.75l.583-.778c.33-.441.495-.661.58-.918.085-.257.085-.533.085-1.116V9.443A3.61 3.61 0 0 0 10.333 5.833c0-2.301-1.865-4.167-4.166-4.167Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M6.167 5.833h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.167 11.667h5c.777 0 1.166 0 1.472.127.409.169.733.493.903.902.127.306.127.694.127 1.471 0 .777 0 1.165-.127 1.472a2 2 0 0 1-.903.902c-.306.127-.695.127-1.472.127h-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12.833 4.167h3.333c.777 0 1.165 0 1.471.127.409.169.733.493.903.902.126.306.126.694.126 1.471 0 .777 0 1.165-.126 1.472a2 2 0 0 1-.903.902c-.306.127-.694.127-1.471.127h-3.333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      display: `<svg viewBox="0 0 21 20" width="20" height="20" fill="none"><path d="M12 17.5h1.667M12 17.5c-.69 0-1.25-.56-1.25-1.25v-2.084h-.417M12 17.5H8.667m1.666-3.334h-.417V16.25c0 .69-.559 1.25-1.25 1.25M10.333 14.166V17.5M8.667 17.5H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.667 2.5H7C4.643 2.5 3.464 2.5 2.732 3.232 2 3.964 2 5.143 2 7.5v1.667c0 2.357 0 3.535.732 4.268.732.732 1.911.732 4.268.732h6.667c2.357 0 3.536 0 4.268-.732.733-.733.733-1.911.733-4.268V7.5c0-2.357 0-3.536-.733-4.268C17.203 2.5 16.024 2.5 13.667 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };
    const ICONS = [
      { value: "bolt", label: "Blesk" },
      { value: "shield", label: "Štít" },
      { value: "server", label: "Server" },
      { value: "code", label: "Kód" },
      { value: "app", label: "Aplikace" },
      { value: "scale", label: "Škály" },
      { value: "k8s", label: "Kontejnery" },
      { value: "pipeline", label: "Pipeline" },
      { value: "move", label: "Migrace" },
      { value: "rocket", label: "Raketa" },
      { value: "check", label: "Check" },
      { value: "lock", label: "Zámek" },
      { value: "speed", label: "Rychlost" },
      { value: "star", label: "Hvězda" },
      { value: "cloud", label: "Cloud" },
      { value: "database", label: "Databáze" },
      { value: "clock", label: "Uptime" },
      { value: "firewall", label: "Firewall" },
      { value: "backup", label: "Záloha" },
      { value: "support", label: "Podpora" },
      { value: "euro", label: "Cena" },
      { value: "chip", label: "GPU/Chip" },
      { value: "globe", label: "Glóbus" },
      { value: "eyeOff", label: "Soukromí" },
      { value: "gear", label: "Automatizace" },
      { value: "docker", label: "Docker" },
      /* nové */
      { value: "eco", label: "Ekologie" },
      { value: "compress", label: "Zjednodušení" },
      { value: "badgeCheck", label: "Ocenění" },
      { value: "users", label: "Uživatelé" },
      { value: "headsetAlt", label: "Podpora (alt)" },
      { value: "display", label: "Monitor" }
    ];
    const rootEl = ref(null);
    ref([]);
    const popoverSide = ref({});
    const openPicker = ref(-1);
    function svgForKey(k) {
      return ICON_SVGS[k] || ICON_SVGS.bolt;
    }
    function onDocClick() {
      openPicker.value = -1;
    }
    onMounted(() => document.addEventListener("click", onDocClick));
    onBeforeUnmount(() => document.removeEventListener("click", onDocClick));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "rootEl",
        ref: rootEl,
        class: "features-box"
      }, _attrs))} data-v-0fd5637e><div class="table-responsive no-inner-scroll" data-v-0fd5637e><table class="table align-middle" data-v-0fd5637e><thead data-v-0fd5637e><tr data-v-0fd5637e><th style="${ssrRenderStyle({ "width": "360px" })}" data-v-0fd5637e>Název <span class="text-muted" data-v-0fd5637e>(klikni na ikonku)</span></th><th data-v-0fd5637e>Popis</th><th style="${ssrRenderStyle({ "width": "160px" })}" class="text-end" data-v-0fd5637e> Akce <button type="button" class="btn btn-primary btn-xxs ms-2" title="Přidat řádek" data-v-0fd5637e><i class="fa-solid fa-plus" data-v-0fd5637e></i></button></th></tr></thead><tbody data-v-0fd5637e><!--[-->`);
      ssrRenderList(items.value, (it, i) => {
        _push(`<tr data-v-0fd5637e><td class="pos-rel" data-v-0fd5637e><div class="input-group input-group-sm" data-v-0fd5637e><button type="button" class="btn btn-light border icon-btn"${ssrRenderAttr("title", `Vybrat ikonu: ${it.icon}`)} data-v-0fd5637e><span class="svg" data-v-0fd5637e>${svgForKey(it.icon)}</span></button><input${ssrRenderAttr("value", it.title)} class="form-control form-control-sm" placeholder="Špičkový výkon" data-v-0fd5637e></div>`);
        if (openPicker.value === i) {
          _push(`<div class="${ssrRenderClass([{ "align-right": popoverSide.value[i] === "right" }, "icon-popover"])}" data-v-0fd5637e><!--[-->`);
          ssrRenderList(ICONS, (opt) => {
            _push(`<button type="button" class="icon-option"${ssrRenderAttr("title", opt.label)} data-v-0fd5637e><span class="svg" data-v-0fd5637e>${ICON_SVGS[opt.value] ?? ""}</span></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td data-v-0fd5637e><textarea rows="2" class="form-control form-control-sm" placeholder="Zaručený výkon díky moderním CPU a rychlé RAM." data-v-0fd5637e>${ssrInterpolate(it.text)}</textarea></td><td class="text-end" data-v-0fd5637e><div class="btn-group btn-group-sm" data-v-0fd5637e><button class="btn btn-light border"${ssrIncludeBooleanAttr(i === 0) ? " disabled" : ""} title="Nahoru" data-v-0fd5637e><i class="fa-solid fa-arrow-up" data-v-0fd5637e></i></button><button class="btn btn-light border"${ssrIncludeBooleanAttr(i === items.value.length - 1) ? " disabled" : ""} title="Dolů" data-v-0fd5637e><i class="fa-solid fa-arrow-down" data-v-0fd5637e></i></button><button class="btn btn-outline-danger" title="Smazat" data-v-0fd5637e><i class="fa-solid fa-trash-can" data-v-0fd5637e></i></button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (!items.value.length) {
        _push(`<tr data-v-0fd5637e><td colspan="3" class="text-center text-muted py-4" data-v-0fd5637e> Zatím žádné položky. Přidej první řádek. </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div class="sticky-add" data-v-0fd5637e><button type="button" class="btn btn-primary btn-sm" data-v-0fd5637e><i class="fa-solid fa-plus me-1" data-v-0fd5637e></i> Přidat řádek </button></div></div>`);
    };
  }
};
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/FeaturesEditor.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const FeaturesEditor = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-0fd5637e"]]);
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FeaturesEditor
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$s = {
  __name: "PageForm",
  __ssrInlineRender: true,
  props: {
    slug: { type: String, required: true },
    initial: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa;
    const props = __props;
    const DEFAULTS = {
      "o-nas": {
        hero: { title: "Naše mise", subtitle: "", image: null },
        counters: [],
        about: { title: "O nás", text: "", image: { src: null } },
        infrastructure: { lead: "", blocks: [] },
        gallery: []
      },
      "kontakt": {
        hero: { title: "Máte dotaz nebo zpětnou vazbu?", subtitle: "", image: null },
        company: { name: "", ic: "", dic: "", registry: "" },
        contacts: { note: "", address: "", email: "", phone: "" },
        map: { embed: "", link: "" }
      }
    };
    const seed = (k) => DEFAULTS[props.slug][k];
    const aboutEnabled = computed(() => props.slug === "o-nas");
    const contactEnabled = computed(() => props.slug === "kontakt");
    const hero = reactive({
      title: ((_c = (_b = (_a = props.initial) == null ? void 0 : _a.data) == null ? void 0 : _b.hero) == null ? void 0 : _c.title) ?? ((_d = props.initial) == null ? void 0 : _d.title) ?? // kdyby někdy přišlo z controlleru
      seed("hero").title,
      subtitle: ((_g = (_f = (_e = props.initial) == null ? void 0 : _e.data) == null ? void 0 : _f.hero) == null ? void 0 : _g.subtitle) ?? seed("hero").subtitle,
      imageUrl: ((_j = (_i = (_h = props.initial) == null ? void 0 : _h.data) == null ? void 0 : _i.hero) == null ? void 0 : _j.image) ?? seed("hero").image,
      imageFile: null
    });
    const counters = ref(
      aboutEnabled.value ? (Array.isArray((_l = (_k = props.initial) == null ? void 0 : _k.data) == null ? void 0 : _l.counters) ? props.initial.data.counters : seed("counters")).map((c) => ({ label: (c == null ? void 0 : c.label) ?? "", value: (c == null ? void 0 : c.value) ?? "" })) : []
    );
    const aboutBox = reactive(
      aboutEnabled.value ? {
        title: ((_o = (_n = (_m = props.initial) == null ? void 0 : _m.data) == null ? void 0 : _n.about) == null ? void 0 : _o.title) ?? seed("about").title,
        text: ((_r = (_q = (_p = props.initial) == null ? void 0 : _p.data) == null ? void 0 : _q.about) == null ? void 0 : _r.text) ?? seed("about").text,
        imageUrl: ((_v = (_u = (_t = (_s = props.initial) == null ? void 0 : _s.data) == null ? void 0 : _t.about) == null ? void 0 : _u.image) == null ? void 0 : _v.src) ?? seed("about").image.src,
        imageFile: null
      } : {}
    );
    const infra = reactive(
      aboutEnabled.value ? {
        lead: ((_y = (_x = (_w = props.initial) == null ? void 0 : _w.data) == null ? void 0 : _x.infrastructure) == null ? void 0 : _y.lead) ?? seed("infrastructure").lead,
        blocks: (Array.isArray((_B = (_A = (_z = props.initial) == null ? void 0 : _z.data) == null ? void 0 : _A.infrastructure) == null ? void 0 : _B.blocks) ? props.initial.data.infrastructure.blocks : seed("infrastructure").blocks).map((b) => ({
          title: (b == null ? void 0 : b.title) ?? "",
          items: Array.isArray(b == null ? void 0 : b.items) && b.items.length ? b.items.map((it) => ({
            badge: (it == null ? void 0 : it.badge) ?? (it == null ? void 0 : it.key) ?? "",
            text: (it == null ? void 0 : it.text) ?? (it == null ? void 0 : it.value) ?? ""
          })) : [{ badge: "", text: "" }]
        }))
      } : {}
    );
    function ensureThree(arr) {
      let out = Array.isArray(arr) ? arr.slice(0, 3) : [];
      while (out.length < 3) out.push({ title: "", src: null });
      return out.map((g, i) => ({
        id: `g${i}-${Math.random().toString(36).slice(2, 7)}`,
        title: (g == null ? void 0 : g.title) ?? "",
        imageUrl: (g == null ? void 0 : g.src) ?? null,
        imageFile: null
      }));
    }
    const gallery = ref(
      aboutEnabled.value ? ensureThree(((_D = (_C = props.initial) == null ? void 0 : _C.data) == null ? void 0 : _D.gallery) ?? seed("gallery")) : []
    );
    const company = reactive(
      contactEnabled.value ? {
        name: ((_G = (_F = (_E = props.initial) == null ? void 0 : _E.data) == null ? void 0 : _F.company) == null ? void 0 : _G.name) ?? "",
        ic: ((_J = (_I = (_H = props.initial) == null ? void 0 : _H.data) == null ? void 0 : _I.company) == null ? void 0 : _J.ic) ?? "",
        dic: ((_M = (_L = (_K = props.initial) == null ? void 0 : _K.data) == null ? void 0 : _L.company) == null ? void 0 : _M.dic) ?? "",
        registry: ((_P = (_O = (_N = props.initial) == null ? void 0 : _N.data) == null ? void 0 : _O.company) == null ? void 0 : _P.registry) ?? ""
      } : {}
    );
    const contacts = reactive(
      contactEnabled.value ? {
        note: ((_S = (_R = (_Q = props.initial) == null ? void 0 : _Q.data) == null ? void 0 : _R.contacts) == null ? void 0 : _S.note) ?? "",
        address: ((_V = (_U = (_T = props.initial) == null ? void 0 : _T.data) == null ? void 0 : _U.contacts) == null ? void 0 : _V.address) ?? "",
        email: ((_Y = (_X = (_W = props.initial) == null ? void 0 : _W.data) == null ? void 0 : _X.contacts) == null ? void 0 : _Y.email) ?? "",
        phone: ((_$ = (__ = (_Z = props.initial) == null ? void 0 : _Z.data) == null ? void 0 : __.contacts) == null ? void 0 : _$.phone) ?? ""
      } : {}
    );
    const mapbox = reactive(
      contactEnabled.value ? {
        embed: ((_ca = (_ba = (_aa = props.initial) == null ? void 0 : _aa.data) == null ? void 0 : _ba.map) == null ? void 0 : _ca.embed) ?? "",
        link: ((_fa = (_ea = (_da = props.initial) == null ? void 0 : _da.data) == null ? void 0 : _ea.map) == null ? void 0 : _fa.link) ?? ""
      } : {}
    );
    const open = reactive({ hero: false, about: false, infra: false, gallery: false, company: false, contact: false, map: false });
    const canSave = computed(() => {
      var _a2, _b2, _c2, _d2;
      const okTitle = (((_b2 = (_a2 = hero.title) == null ? void 0 : _a2.trim()) == null ? void 0 : _b2.length) || 0) > 0;
      const okSub = (((_d2 = (_c2 = hero.subtitle) == null ? void 0 : _c2.trim()) == null ? void 0 : _d2.length) || 0) > 0;
      const hasImg = !!hero.imageFile || !!(hero.imageUrl && String(hero.imageUrl).trim() !== "");
      return okTitle && okSub && hasImg;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pageform" }, _attrs))} data-v-598483de><div class="card-wrap" data-v-598483de><div class="card-head clickable" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", open.hero)} data-v-598483de><div class="${ssrRenderClass([{ open: open.hero }, "chev"])}" data-v-598483de><i class="fa-solid fa-chevron-down" data-v-598483de></i></div><h3 class="title" data-v-598483de>Hero</h3></div><div class="card-body" style="${ssrRenderStyle(open.hero ? null : { display: "none" })}" data-v-598483de><div class="mb-2" data-v-598483de><label class="form-label" data-v-598483de>Nadpis</label><input class="form-control"${ssrRenderAttr("value", hero.title)} placeholder="Např. Naše mise" data-v-598483de></div><div class="mb-2" data-v-598483de><label class="form-label" data-v-598483de>Podnadpis</label><input class="form-control"${ssrRenderAttr("value", hero.subtitle)} placeholder="Krátký podtitulek…" data-v-598483de></div><div class="mb-2" data-v-598483de><label class="form-label" data-v-598483de>Hero obrázek (povinný)</label>`);
      _push(ssrRenderComponent(DropzoneImage, {
        file: hero.imageFile,
        "onUpdate:file": ($event) => hero.imageFile = $event,
        url: hero.imageUrl,
        "onUpdate:url": ($event) => hero.imageUrl = $event,
        "preview-w": 640,
        "preview-h": 360,
        "preview-ratio": "16 / 9",
        "object-fit": "cover",
        placeholder: "Přetáhni nebo vyber obrázek",
        hint: "PNG/JPG/WEBP, ideálně 1600×900 px."
      }, null, _parent));
      _push(`<small class="text-muted d-block mt-1" data-v-598483de>Ponech prázdné jen pokud už je nastavený existující obrázek výše.</small></div>`);
      if (aboutEnabled.value) {
        _push(`<div class="counters" data-v-598483de><div class="c-head" data-v-598483de><h4 data-v-598483de>Počítadla (zobrazují se v hero)</h4></div><div class="vstack gap-2" data-v-598483de><!--[-->`);
        ssrRenderList(counters.value, (c, i) => {
          _push(`<div class="grid counter-line" data-v-598483de><input class="form-control"${ssrRenderAttr("value", c.label)} placeholder="Popisek (např. Působíme na českém trhu)" data-v-598483de><input class="form-control value"${ssrRenderAttr("value", c.value)} placeholder="Hodnota (např. 21 let)" data-v-598483de></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (aboutEnabled.value) {
        _push(`<!--[--><div class="card-wrap" data-v-598483de><div class="card-head clickable" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", open.about)} data-v-598483de><div class="${ssrRenderClass([{ open: open.about }, "chev"])}" data-v-598483de><i class="fa-solid fa-chevron-down" data-v-598483de></i></div><h3 class="title" data-v-598483de>Sekce „O nás“</h3></div><div class="card-body" style="${ssrRenderStyle(open.about ? null : { display: "none" })}" data-v-598483de><div class="mb-2" data-v-598483de><label class="form-label" data-v-598483de>Titulek sekce</label><input class="form-control"${ssrRenderAttr("value", aboutBox.title)} placeholder="O nás" data-v-598483de></div><div class="mb-2" data-v-598483de><label class="form-label" data-v-598483de>Text</label><textarea class="form-control" rows="6" placeholder="Delší popis…" data-v-598483de>${ssrInterpolate(aboutBox.text)}</textarea></div><div data-v-598483de><label class="form-label" data-v-598483de>Obrázek sekce</label>`);
        _push(ssrRenderComponent(DropzoneImage, {
          file: aboutBox.imageFile,
          "onUpdate:file": ($event) => aboutBox.imageFile = $event,
          url: aboutBox.imageUrl,
          "onUpdate:url": ($event) => aboutBox.imageUrl = $event,
          "preview-w": 480,
          "preview-h": 320,
          "preview-ratio": "3 / 2",
          "object-fit": "cover",
          placeholder: "Přetáhni nebo vyber obrázek",
          hint: "PNG/JPG/WEBP ~ 1200×800 px."
        }, null, _parent));
        _push(`</div></div></div><div class="card-wrap" data-v-598483de><div class="card-head clickable" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", open.infra)} data-v-598483de><div class="${ssrRenderClass([{ open: open.infra }, "chev"])}" data-v-598483de><i class="fa-solid fa-chevron-down" data-v-598483de></i></div><h3 class="title" data-v-598483de>Infrastruktura</h3></div><div class="card-body" style="${ssrRenderStyle(open.infra ? null : { display: "none" })}" data-v-598483de><div class="mb-3" data-v-598483de><label class="form-label" data-v-598483de>Úvodní věta</label><input class="form-control"${ssrRenderAttr("value", infra.lead)} placeholder="Vlastní racky v datacentru…" data-v-598483de></div><div class="vstack gap-4" data-v-598483de><!--[-->`);
        ssrRenderList(infra.blocks, (b, bi) => {
          _push(`<div class="block" data-v-598483de><label class="form-label mb-1" data-v-598483de>Titulek bloku (nadpis)</label><input class="form-control title-input"${ssrRenderAttr("value", b.title)} placeholder="Např. Konfigurace serverů" data-v-598483de><div class="vstack gap-2 mt-3" data-v-598483de><!--[-->`);
          ssrRenderList(b.items, (it, ii) => {
            _push(`<div class="grid two align-center" data-v-598483de><input class="form-control"${ssrRenderAttr("value", it.badge)} placeholder="Štítek (např. Virtualizace)" data-v-598483de><div class="d-flex gap-2" data-v-598483de><input class="form-control"${ssrRenderAttr("value", it.text)} placeholder="Text (např. KVM + Proxmox)" data-v-598483de>`);
            if (b.items.length > 1) {
              _push(`<button class="btn btn-ghost danger" title="Smazat položku" data-v-598483de><i class="fa-regular fa-trash-can" data-v-598483de></i></button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div><button class="btn btn-light border btn-sm mt-2" data-v-598483de><i class="fa-solid fa-plus me-1" data-v-598483de></i> Přidat položku </button><hr class="my-3" data-v-598483de></div>`);
        });
        _push(`<!--]--></div></div></div><div class="card-wrap" data-v-598483de><div class="card-head clickable" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", open.gallery)} data-v-598483de><div class="${ssrRenderClass([{ open: open.gallery }, "chev"])}" data-v-598483de><i class="fa-solid fa-chevron-down" data-v-598483de></i></div><h3 class="title" data-v-598483de>Galerie (právě 3 obrázky)</h3></div><div class="card-body" style="${ssrRenderStyle(open.gallery ? null : { display: "none" })}" data-v-598483de><div class="grid three align-start" data-v-598483de><!--[-->`);
        ssrRenderList(gallery.value, (g, i) => {
          _push(`<div data-v-598483de>`);
          _push(ssrRenderComponent(DropzoneImage, {
            file: g.imageFile,
            "onUpdate:file": ($event) => g.imageFile = $event,
            url: g.imageUrl,
            "onUpdate:url": ($event) => g.imageUrl = $event,
            "preview-w": 260,
            "preview-h": 156,
            "preview-ratio": "5 / 3",
            "object-fit": "cover",
            placeholder: "Obrázek",
            hint: "PNG/JPG/WEBP"
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div><small class="text-muted d-block mt-2" data-v-598483de>Alt se vyplní automaticky (titulek není potřeba vyplňovat).</small></div></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (contactEnabled.value) {
        _push(`<!--[--><div class="card-wrap" data-v-598483de><div class="card-head clickable" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", open.company)} data-v-598483de><div class="${ssrRenderClass([{ open: open.company }, "chev"])}" data-v-598483de><i class="fa-solid fa-chevron-down" data-v-598483de></i></div><h3 class="title" data-v-598483de>Firemní údaje</h3></div><div class="card-body" style="${ssrRenderStyle(open.company ? null : { display: "none" })}" data-v-598483de><div class="grid two" data-v-598483de><div data-v-598483de><label class="form-label" data-v-598483de>Název</label><input class="form-control"${ssrRenderAttr("value", company.name)} placeholder="IT Globe s.r.o. (OpenVPS)" data-v-598483de></div><div data-v-598483de><label class="form-label" data-v-598483de>IČ</label><input class="form-control"${ssrRenderAttr("value", company.ic)} placeholder="14117215" data-v-598483de></div></div><div class="grid two mt-2" data-v-598483de><div data-v-598483de><label class="form-label" data-v-598483de>DIČ</label><input class="form-control"${ssrRenderAttr("value", company.dic)} placeholder="" data-v-598483de></div><div data-v-598483de><label class="form-label" data-v-598483de>Obchodní rejstřík</label><input class="form-control"${ssrRenderAttr("value", company.registry)} placeholder="Krajský soud v ..." data-v-598483de></div></div></div></div><div class="card-wrap" data-v-598483de><div class="card-head clickable" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", open.contact)} data-v-598483de><div class="${ssrRenderClass([{ open: open.contact }, "chev"])}" data-v-598483de><i class="fa-solid fa-chevron-down" data-v-598483de></i></div><h3 class="title" data-v-598483de>Kontakty</h3></div><div class="card-body" style="${ssrRenderStyle(open.contact ? null : { display: "none" })}" data-v-598483de><div class="grid two" data-v-598483de><div data-v-598483de><label class="form-label" data-v-598483de>Poznámka</label><input class="form-control"${ssrRenderAttr("value", contacts.note)} placeholder="K dispozici 24/7" data-v-598483de></div><div data-v-598483de><label class="form-label" data-v-598483de>Adresa</label><input class="form-control"${ssrRenderAttr("value", contacts.address)} placeholder="Orlické Podhůří 30, 562 01 Ústí nad Orlicí" data-v-598483de></div></div><div class="grid two mt-2" data-v-598483de><div data-v-598483de><label class="form-label" data-v-598483de>E-mail</label><input class="form-control"${ssrRenderAttr("value", contacts.email)} placeholder="info@openvps.cz" data-v-598483de></div><div data-v-598483de><label class="form-label" data-v-598483de>Telefon</label><input class="form-control"${ssrRenderAttr("value", contacts.phone)} placeholder="+420 ..." data-v-598483de></div></div></div></div><div class="card-wrap" data-v-598483de><div class="card-head clickable" role="button" tabindex="0"${ssrRenderAttr("aria-expanded", open.map)} data-v-598483de><div class="${ssrRenderClass([{ open: open.map }, "chev"])}" data-v-598483de><i class="fa-solid fa-chevron-down" data-v-598483de></i></div><h3 class="title" data-v-598483de>Mapa</h3></div><div class="card-body" style="${ssrRenderStyle(open.map ? null : { display: "none" })}" data-v-598483de><div class="grid two" data-v-598483de><div data-v-598483de><label class="form-label" data-v-598483de>Embed URL (iframe)</label><input class="form-control"${ssrRenderAttr("value", mapbox.embed)} placeholder="https://www.google.com/maps?...&amp;output=embed" data-v-598483de></div><div data-v-598483de><label class="form-label" data-v-598483de>Otevřít v Mapách (odkaz)</label><input class="form-control"${ssrRenderAttr("value", mapbox.link)} placeholder="https://www.google.com/maps/..." data-v-598483de></div></div></div></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="actions-bottom" data-v-598483de><button class="btn btn-primary"${ssrIncludeBooleanAttr(!canSave.value) ? " disabled" : ""} data-v-598483de>Uložit změny</button></div></div>`);
    };
  }
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/PageForm.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const PageForm = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-598483de"]]);
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PageForm
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$r = {
  __name: "RichTextEditor",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    label: { type: String, default: "Text" },
    placeholder: { type: String, default: "Začni psát…" }
  }, {
    "html": { type: String, default: "" },
    "htmlModifiers": {}
  }),
  emits: ["update:html"],
  setup(__props) {
    const htmlModel = useModel(__props, "html");
    const props = __props;
    const editor = ref(null);
    const internal = ref(false);
    onMounted(() => {
      editor.value = new Editor({
        content: htmlModel.value || "",
        extensions: [
          Document,
          Paragraph,
          Text,
          Heading.configure({ levels: [3] }),
          // jen H3
          BulletList,
          OrderedList,
          ListItem,
          History,
          Placeholder.configure({ placeholder: props.placeholder })
          // ZÁMĚRNĚ BEZ HardBreak – nebudeme nikdy ukládat <br>
        ],
        onUpdate({ editor: editor2 }) {
          internal.value = true;
          htmlModel.value = editor2.getHTML();
          nextTick(() => {
            internal.value = false;
          });
        }
      });
    });
    watch(htmlModel, (v) => {
      if (!editor.value || internal.value) return;
      const current = editor.value.getHTML();
      if (v !== current) editor.value.commands.setContent(v || "", false);
    });
    onBeforeUnmount(() => {
      var _a;
      return (_a = editor.value) == null ? void 0 : _a.destroy();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rte" }, _attrs))} data-v-b27b3f22><label class="form-label" data-v-b27b3f22>${ssrInterpolate(__props.label)}</label><div class="toolbar" data-v-b27b3f22><button type="button" class="btn btn-light border btn-sm" title="Nadpis H3" data-v-b27b3f22><i class="fa-solid fa-heading" data-v-b27b3f22></i> H3 </button><button type="button" class="btn btn-light border btn-sm" title="Seznam UL" data-v-b27b3f22><i class="fa-solid fa-list-ul" data-v-b27b3f22></i></button><button type="button" class="btn btn-light border btn-sm" title="Seznam OL" data-v-b27b3f22><i class="fa-solid fa-list-ol" data-v-b27b3f22></i></button></div><div class="editor-wrap" data-v-b27b3f22>`);
      _push(ssrRenderComponent(unref(EditorContent), { editor: editor.value }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/RichTextEditor.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const RichTextEditor = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-b27b3f22"]]);
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RichTextEditor
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$q = {
  __name: "SectionCard",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    index: { type: Number, required: true },
    total: { type: Number, required: true }
  }, {
    "modelValue": { type: Object, required: true },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["moveUp", "moveDown", "insertBelow", "remove"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const section = useModel(__props, "modelValue");
    const needsImage = computed(() => ["split-left", "split-right"].includes(section.value.layout));
    const needsTwoCols = computed(() => section.value.layout === "columns");
    const layoutLabel = computed(() => {
      switch (section.value.layout) {
        case "split-left":
          return "Obrázek + text";
        case "split-right":
          return "Text + obrázek";
        case "columns":
          return "Dva sloupce";
        default:
          return "Jen text";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section-card" }, _attrs))} data-v-8075f0ea><div class="section-head" data-v-8075f0ea><div class="info" data-v-8075f0ea><span class="badge" data-v-8075f0ea>Sekce #${ssrInterpolate(__props.index + 1)}</span><strong class="title" data-v-8075f0ea>${ssrInterpolate(section.value.title || "Bez názvu")}</strong><span class="muted" data-v-8075f0ea>(${ssrInterpolate(layoutLabel.value)})</span></div><div class="actions" data-v-8075f0ea><button class="btn btn-light border btn-sm"${ssrIncludeBooleanAttr(__props.index === 0) ? " disabled" : ""} title="Přesunout nahoru" data-v-8075f0ea><i class="fa-solid fa-arrow-up" data-v-8075f0ea></i></button><button class="btn btn-light border btn-sm"${ssrIncludeBooleanAttr(__props.index === __props.total - 1) ? " disabled" : ""} title="Přesunout dolů" data-v-8075f0ea><i class="fa-solid fa-arrow-down" data-v-8075f0ea></i></button><button class="btn btn-light border btn-sm" title="Přidat prázdnou sekci pod" data-v-8075f0ea><i class="fa-solid fa-plus" data-v-8075f0ea></i></button><button class="btn btn-outline-danger btn-sm" title="Smazat sekci" data-v-8075f0ea><i class="fa-solid fa-trash-can" data-v-8075f0ea></i></button></div></div><div class="layout-picker" data-v-8075f0ea><button type="button" class="${ssrRenderClass(["layout-card", section.value.layout === "split-left" && "selected"])}" data-v-8075f0ea><div class="wire wire-split" data-v-8075f0ea><span class="img left" data-v-8075f0ea></span><span class="txt right" data-v-8075f0ea></span></div><span class="label" data-v-8075f0ea><i class="fa-solid fa-image me-1" data-v-8075f0ea></i> Obrázek + text</span></button><button type="button" class="${ssrRenderClass(["layout-card", section.value.layout === "split-right" && "selected"])}" data-v-8075f0ea><div class="wire wire-split" data-v-8075f0ea><span class="txt left" data-v-8075f0ea></span><span class="img right" data-v-8075f0ea></span></div><span class="label" data-v-8075f0ea><i class="fa-solid fa-image me-1" data-v-8075f0ea></i> Text + obrázek</span></button><button type="button" class="${ssrRenderClass(["layout-card", section.value.layout === "text" && "selected"])}" data-v-8075f0ea><div class="wire wire-text" data-v-8075f0ea></div><span class="label" data-v-8075f0ea><i class="fa-solid fa-align-left me-1" data-v-8075f0ea></i> Jen text</span></button><button type="button" class="${ssrRenderClass(["layout-card", section.value.layout === "columns" && "selected"])}" data-v-8075f0ea><div class="wire wire-cols" data-v-8075f0ea></div><span class="label" data-v-8075f0ea><i class="fa-solid fa-columns me-1" data-v-8075f0ea></i> Dva sloupce textu</span></button></div><div class="fields" data-v-8075f0ea><div class="mb-3" data-v-8075f0ea><label class="form-label" data-v-8075f0ea>Nadpis sekce (nepovinné)</label><input${ssrRenderAttr("value", section.value.title)} class="form-control" placeholder="např. VPS bez kompromisů" data-v-8075f0ea></div><div class="mb-3" data-v-8075f0ea>`);
      _push(ssrRenderComponent(RichTextEditor, {
        label: "Text 1",
        placeholder: "Obsah první části…",
        modelValue: section.value.text1,
        "onUpdate:modelValue": ($event) => section.value.text1 = $event,
        html: section.value.text1Html,
        "onUpdate:html": ($event) => section.value.text1Html = $event
      }, null, _parent));
      _push(`</div>`);
      if (needsTwoCols.value) {
        _push(`<div class="mb-3" data-v-8075f0ea>`);
        _push(ssrRenderComponent(RichTextEditor, {
          label: "Text 2 (volitelně)",
          placeholder: "Doplňující text…",
          modelValue: section.value.text2,
          "onUpdate:modelValue": ($event) => section.value.text2 = $event,
          html: section.value.text2Html,
          "onUpdate:html": ($event) => section.value.text2Html = $event
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (needsImage.value) {
        _push(`<div class="mb-2" data-v-8075f0ea><label class="form-label" data-v-8075f0ea>Obrázek sekce</label>`);
        _push(ssrRenderComponent(DropzoneImage, {
          file: section.value.imageFile,
          "onUpdate:file": ($event) => section.value.imageFile = $event,
          url: section.value.imageUrl,
          "onUpdate:url": ($event) => section.value.imageUrl = $event,
          "preview-w": 260,
          "preview-h": 150,
          "preview-ratio": "16 / 9",
          "object-fit": "cover",
          placeholder: "Přetáhni sem obrázek nebo vyber soubor",
          hint: "PNG/JPG, ideálně 1200×800px."
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/SectionCard.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const SectionCard = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-8075f0ea"]]);
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SectionCard
}, Symbol.toStringTag, { value: "Module" }));
const basePath = "/sluzby/";
const _sfc_main$p = {
  __name: "ServiceForm",
  __ssrInlineRender: true,
  props: {
    mode: { type: String, default: "create" },
    // 'create' | 'edit'
    initial: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    var _a, _b, _c, _d, _e;
    const props = __props;
    const CATEGORY_OPTS = [
      { value: "server", label: "Server", send: "Servery" },
      { value: "kontejner", label: "Kontejner", send: "Kontejnery" },
      { value: "aplikace", label: "Aplikace", send: "Aplikace" }
    ];
    Object.fromEntries(CATEGORY_OPTS.map((o) => [o.value, o.send]));
    const CAT_REV = { "Servery": "server", "Kontejnery": "kontejner", "Aplikace": "aplikace" };
    const ICON_SVGS = {
      server: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
      gauge: `<svg viewBox="0 -960 960 960"><path fill="currentColor" d="M120-160v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80-440v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80 280v-160h720v160H120Zm80-40h80v-80h-80v80Z"/></svg>`,
      docker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18v4a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7v-4Z"/><path d="M7 10V6h4v4m0-4v4m4-4v4m0-4h4v4"/></svg>`,
      k8s: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2.2 15.5 5v10L10 17.8 4.5 15V5L10 2.2z"/><path d="M10 5v10M5.8 7.5l8.4 5M14.2 7.5l-8.4 5"/></svg>`,
      gitBranch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M15 6a3 3 0 0 1-3 3H6"/></svg>`,
      pipeline: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="4.5" cy="10" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="15.5" cy="10" r="1.7"/><path d="M6.2 10h2.1M11.7 10h2.1"/></svg>`,
      layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 12 15 2 8.5 12 2"/><polyline points="2 17 12 23 22 17"/></svg>`,
      app: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1.2"/><rect x="11" y="3" width="6" height="6" rx="1.2"/><rect x="3" y="11" width="6" height="6" rx="1.2"/><rect x="11" y="11" width="6" height="6" rx="1.2"/></svg>`,
      code: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 6.5 4 10l3.5 3.5M12.5 6.5 16 10l-3.5 3.5"/></svg>`,
      cloudUpload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16l-4-4-4 4"/><path d="M12 12v9"/><path d="M20.39 18.39A9 9 0 1 0 3 12h1.26"/></svg>`,
      move: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="5" height="9" rx="1.2"/><rect x="12.5" y="5.5" width="5" height="9" rx="1.2"/><path d="M6.5 8H14.5"/><path d="M14.5 8l-2-2M14.5 8l-2 2"/><path d="M14.5 12H6.5"/><path d="M6.5 12l2-2M6.5 12l2 2"/></svg>`,
      shield: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M10 18c4.5-2 7-4.5 7-9.5V4.7c0-.4-.3-.7-.7-.8C13.7 3.4 12 2.9 10 2 8 2.9 6.3 3.4 3.7 3.9c-.4.1-.7.4-.7.8V8.5C3 13.5 5.5 16 10 18z"/></svg>`,
      bolt: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 1.75 4.5 10.25h4l-1 8 6-8h-4l1-6.5z"/></svg>`,
      gear: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="2.5"/><path d="M10 2.8v2.2M10 15v2.2M2.8 10H5M15 10h2.2M4.4 4.4l1.6 1.6M14 14l1.6 1.6M15.6 4.4 14 6M6 14l-1.6 1.6"/></svg>`,
      cloud: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 15.5h7.5a3.5 3.5 0 1 0-.6-6.9 4.5 4.5 0 0 0-8.8 1.4A3.2 3.2 0 0 0 6.5 15.5z"/></svg>`,
      database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"/></svg>`,
      network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>`,
      cloudStorage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 17.6A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.25"/><path d="M16 16v5l4-4-4-4v3z"/></svg>`,
      monitoring: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M7 13l3-3 2 2 3-3 2 2"/></svg>`,
      cluster: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`
    };
    const ICONS = [
      { value: "server", label: "Server" },
      { value: "gauge", label: "Spravované servery" },
      { value: "docker", label: "Docker" },
      { value: "k8s", label: "Kubernetes" },
      { value: "gitBranch", label: "Git / CI" },
      { value: "pipeline", label: "Pipeline" },
      { value: "layers", label: "Firemní aplikace" },
      { value: "app", label: "Aplikace (grid)" },
      { value: "code", label: "Zakázkový vývoj" },
      { value: "cloudUpload", label: "Cloud upload" },
      { value: "move", label: "Migrace" },
      { value: "shield", label: "Bezpečnost" },
      { value: "bolt", label: "Výkon" },
      { value: "gear", label: "Automatizace" },
      { value: "cloud", label: "Cloud" },
      { value: "database", label: "Databáze" },
      { value: "network", label: "Síť" },
      { value: "cloudStorage", label: "Cloud storage" },
      { value: "monitoring", label: "Monitoring" },
      { value: "cluster", label: "Cluster" }
    ];
    function slugify(s) {
      return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }
    function oneHtmlFromParas(paras = []) {
      const parts = [];
      (paras || []).forEach((p) => {
        const h2 = ((p == null ? void 0 : p.html) ?? "").trim();
        const t = ((p == null ? void 0 : p.text) ?? "").trim();
        if (h2) parts.push(h2);
        else if (t) parts.push(`<p>${t}</p>`);
      });
      return parts.join("");
    }
    function fromServerSection(s, i = 0) {
      var _a2, _b2, _c2;
      const type = ((s == null ? void 0 : s.type) || "split").toLowerCase();
      if (type === "columns") {
        const raw0 = (_a2 = s == null ? void 0 : s.columns) == null ? void 0 : _a2[0];
        const raw1 = (_b2 = s == null ? void 0 : s.columns) == null ? void 0 : _b2[1];
        const c0 = Array.isArray(raw0) ? raw0 : (raw0 == null ? void 0 : raw0.content) ?? (raw0 == null ? void 0 : raw0.paragraphs) ?? [];
        const c1 = Array.isArray(raw1) ? raw1 : (raw1 == null ? void 0 : raw1.content) ?? (raw1 == null ? void 0 : raw1.paragraphs) ?? [];
        const html1 = oneHtmlFromParas(c0);
        const html2 = oneHtmlFromParas(c1);
        return {
          id: `${i}`,
          layout: "columns",
          title: (s == null ? void 0 : s.title) || "",
          // naplníme obojí, aby editor fungoval s čímkoli uvnitř SectionCard
          text1: html1,
          text1Html: html1,
          text2: html2,
          text2Html: html2,
          imageFile: null,
          imageUrl: "",
          removeImage: false
        };
      }
      const rawParas = (s == null ? void 0 : s.content) ?? (s == null ? void 0 : s.paragraphs) ?? [];
      const paras = Array.isArray(rawParas) ? rawParas : (rawParas == null ? void 0 : rawParas.content) ?? (rawParas == null ? void 0 : rawParas.paragraphs) ?? [];
      const html = oneHtmlFromParas(paras);
      const img = ((_c2 = s == null ? void 0 : s.image) == null ? void 0 : _c2.src) || "";
      const left = (s == null ? void 0 : s.imgLeft) ?? String((s == null ? void 0 : s.imagePosition) || "").toLowerCase() === "left";
      const layout = img ? left ? "split-left" : "split-right" : "text";
      return {
        id: `${i}`,
        layout,
        title: (s == null ? void 0 : s.title) || "",
        text1: html,
        text1Html: html,
        text2: "",
        text2Html: "",
        imageFile: null,
        imageUrl: img,
        removeImage: false
      };
    }
    const step = ref(1);
    const form = reactive({
      /* ids & meta */
      id: props.initial.id || null,
      title: props.initial.title || "",
      slug: props.initial.slug || "",
      category: props.mode === "edit" ? CAT_REV[(props.initial.category || "").trim()] || (["server", "kontejner", "aplikace"].includes(props.initial.category) ? props.initial.category : "") : "",
      is_published: !!props.initial.is_published,
      /* MENU ICON – plná logika z AddServiceForm */
      menuIcon: props.initial.menu_icon && ICON_SVGS[props.initial.menu_icon] ? props.initial.menu_icon : "server",
      useCustomSvg: !!(props.initial.menu_icon_svg && (!props.initial.menu_icon || props.initial.menu_icon === "__custom" || !ICON_SVGS[props.initial.menu_icon])),
      customSvg: (props.initial.menu_icon_svg || "").trim(),
      /* HERO */
      hero: {
        title: ((_a = props.initial.hero) == null ? void 0 : _a.title) || (props.initial.title || ""),
        lead: ((_b = props.initial.hero) == null ? void 0 : _b.lead) || "",
        imageFile: null,
        imageUrl: ((_c = props.initial.hero) == null ? void 0 : _c.image) || "",
        remove: false
      }
    });
    const sections = ref(
      props.mode === "edit" ? (props.initial.sections || []).map(fromServerSection) : []
    );
    if (props.mode === "create" && sections.value.length === 0) {
      sections.value.push({
        id: ((_d = crypto == null ? void 0 : crypto.randomUUID) == null ? void 0 : _d.call(crypto)) || String(Date.now()),
        layout: "text",
        title: "",
        text1: "",
        text1Html: "",
        text2: "",
        text2Html: "",
        imageFile: null,
        imageUrl: "",
        removeImage: false
      });
    }
    const features = ref(
      props.mode === "edit" ? (((_e = props.initial.features) == null ? void 0 : _e.items) || []).map((it) => ({ title: it.title || "", text: it.text || "", icon: it.icon || "bolt" })) : []
    );
    watch(() => form.title, (v) => {
      if (props.mode === "create") {
        if (!form.slug || form.slug === slugify(form.slug)) form.slug = slugify(v || "");
        if (!form.hero.title) form.hero.title = v || "";
      }
    });
    const step1Valid = computed(() => form.title.trim() && form.slug.trim() && (!!form.category || props.mode === "edit"));
    const step2Valid = computed(() => form.hero.title.trim() && form.hero.lead.trim() && (props.mode === "edit" || !!form.hero.imageFile));
    function insertBelow(idx) {
      var _a2;
      sections.value.splice(idx + 1, 0, { ...sections.value[idx], id: ((_a2 = crypto == null ? void 0 : crypto.randomUUID) == null ? void 0 : _a2.call(crypto)) || String(Date.now() + Math.random()), imageFile: null, imageUrl: "", removeImage: false });
    }
    function removeSection(idx) {
      sections.value.splice(idx, 1);
    }
    function moveUp(idx) {
      if (idx > 0) sections.value.splice(idx - 1, 2, sections.value[idx], sections.value[idx - 1]);
    }
    function moveDown(idx) {
      if (idx < sections.value.length - 1) sections.value.splice(idx, 2, sections.value[idx + 1], sections.value[idx]);
    }
    const customUri = computed(() => (form.customSvg || "").trim());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card-wrap" }, _attrs))} data-v-139b3818><div class="stepper" data-v-139b3818><div class="${ssrRenderClass(["step", step.value === 1 ? "active" : step.value > 1 ? "done" : ""])}" data-v-139b3818><span class="num" data-v-139b3818>1</span><span data-v-139b3818>Základní údaje</span></div><div class="sep" data-v-139b3818></div><div class="${ssrRenderClass(["step", step.value === 2 ? "active" : step.value > 2 ? "done" : ""])}" data-v-139b3818><span class="num" data-v-139b3818>2</span><span data-v-139b3818>Hero</span></div><div class="sep" data-v-139b3818></div><div class="${ssrRenderClass(["step", step.value === 3 ? "active" : step.value > 3 ? "done" : ""])}" data-v-139b3818><span class="num" data-v-139b3818>3</span><span data-v-139b3818>Sekce</span></div><div class="sep" data-v-139b3818></div><div class="${ssrRenderClass(["step", step.value === 4 ? "active" : ""])}" data-v-139b3818><span class="num" data-v-139b3818>4</span><span data-v-139b3818>Výhody</span></div></div>`);
      if (step.value === 1) {
        _push(`<div class="form-grid centered" data-v-139b3818><div class="mb-3" data-v-139b3818><label class="form-label text-center w-100" data-v-139b3818>Název stránky</label><input${ssrRenderAttr("value", form.title)} class="form-control" placeholder="např. VPS server" data-v-139b3818></div><div class="mb-3" data-v-139b3818><label class="form-label text-center w-100" data-v-139b3818>URL (slug)</label><div class="input-group" data-v-139b3818><span class="input-group-text" data-v-139b3818>${ssrInterpolate(basePath)}</span><input${ssrRenderAttr("value", form.slug)} class="form-control" placeholder="vps-server" data-v-139b3818></div></div><div class="mb-3" data-v-139b3818><label class="form-label text-center w-100" data-v-139b3818>Kategorie</label><div class="cat-grid" role="radiogroup" aria-label="Výběr kategorie" data-v-139b3818><!--[-->`);
        ssrRenderList(CATEGORY_OPTS, (opt) => {
          _push(`<button type="button" class="${ssrRenderClass([{ active: form.category === opt.value }, "cat-chip"])}"${ssrRenderAttr("aria-pressed", form.category === opt.value)}${ssrRenderAttr("title", opt.label)} data-v-139b3818>${ssrInterpolate(opt.label)}</button>`);
        });
        _push(`<!--]--></div></div><div class="mb-3" data-v-139b3818><label class="form-label text-center w-100" data-v-139b3818>Ikona v menu</label><div class="icon-grid" role="listbox" aria-label="Výběr ikony" data-v-139b3818>`);
        if (form.useCustomSvg && customUri.value) {
          _push(`<button type="button" class="${ssrRenderClass([{ active: form.menuIcon === "__custom" }, "icon-chip"])}" aria-label="Vlastní SVG" title="Vlastní SVG" data-v-139b3818><span class="svg" data-v-139b3818>${customUri.value ?? ""}</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(ICONS, (opt) => {
          _push(`<button type="button" class="${ssrRenderClass([{ active: form.menuIcon === opt.value }, "icon-chip"])}"${ssrRenderAttr("aria-selected", form.menuIcon === opt.value)}${ssrRenderAttr("aria-label", opt.label)}${ssrRenderAttr("title", opt.label)} data-v-139b3818><span class="svg" data-v-139b3818>${ICON_SVGS[opt.value] ?? ""}</span></button>`);
        });
        _push(`<!--]--></div><label class="form-check mt-3 text-center custom-svg-click" data-v-139b3818><input class="form-check-input" type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.useCustomSvg) ? ssrLooseContain(form.useCustomSvg, null) : form.useCustomSvg) ? " checked" : ""} data-v-139b3818><span class="form-check-label" data-v-139b3818> Chci nahrát vlastní SVG <div class="hint" data-v-139b3818> Vlož kód SVG (od <code data-v-139b3818>&lt;svg …&gt;</code> do <code data-v-139b3818>&lt;/svg&gt;</code>). Při uložení se zapíše do <code data-v-139b3818>menu_icon_svg</code>; jinak se použije vybraná předvolená ikona. </div></span></label>`);
        if (form.useCustomSvg) {
          _push(`<textarea class="form-control mt-2 mono" rows="5" placeholder="&lt;svg ...&gt;…&lt;/svg&gt;" data-v-139b3818>${ssrInterpolate(form.customSvg)}</textarea>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="actions center" data-v-139b3818><button class="btn btn-primary"${ssrIncludeBooleanAttr(!step1Valid.value) ? " disabled" : ""} data-v-139b3818> Pokračovat na „Hero“ </button></div></div>`);
      } else if (step.value === 2) {
        _push(`<div class="form-grid full" data-v-139b3818><div class="mb-3" data-v-139b3818><label class="form-label" data-v-139b3818>Hero nadpis</label><input${ssrRenderAttr("value", form.hero.title)} class="form-control"${ssrRenderAttr("placeholder", form.title || "Nadpis na hero")} data-v-139b3818></div><div class="mb-3" data-v-139b3818><label class="form-label" data-v-139b3818>Hero text</label><textarea rows="3" class="form-control" placeholder="Krátký úvodní text..." data-v-139b3818>${ssrInterpolate(form.hero.lead)}</textarea></div><div class="mb-2" data-v-139b3818><label class="form-label" data-v-139b3818>Hero obrázek</label>`);
        if (props.mode === "edit" && form.hero.imageUrl && !form.hero.imageFile && !form.hero.remove) {
          _push(`<div class="mb-2" data-v-139b3818><img${ssrRenderAttr("src", form.hero.imageUrl)} alt="" style="${ssrRenderStyle({ "max-width": "320px", "border-radius": "10px", "border": "1px solid #e9eaeb" })}" data-v-139b3818></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(DropzoneImage, {
          file: form.hero.imageFile,
          "onUpdate:file": ($event) => form.hero.imageFile = $event,
          url: form.hero.imageUrl,
          "onUpdate:url": ($event) => form.hero.imageUrl = $event,
          "preview-w": 320,
          "preview-h": 180,
          "preview-ratio": "16 / 9",
          "object-fit": "cover",
          placeholder: "Přetáhni sem obrázek nebo vyber soubor",
          hint: "PNG/JPG/WEBP, ideálně 1600×900px."
        }, null, _parent));
        if (props.mode === "edit") {
          _push(`<label class="form-check mt-2" data-v-139b3818><input class="form-check-input" type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.hero.remove) ? ssrLooseContain(form.hero.remove, null) : form.hero.remove) ? " checked" : ""} data-v-139b3818><span class="form-check-label" data-v-139b3818>Odebrat aktuální hero obrázek</span></label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="actions" data-v-139b3818><button class="btn btn-light border" data-v-139b3818>Zpět</button><button class="btn btn-primary"${ssrIncludeBooleanAttr(!step2Valid.value) ? " disabled" : ""} data-v-139b3818>Pokračovat na „Sekce“</button></div></div>`);
      } else if (step.value === 3) {
        _push(`<div class="form-grid full" data-v-139b3818><div class="d-flex align-items-center justify-content-between mb-2" data-v-139b3818><h3 class="mb-0 h6 fw-extrabold" data-v-139b3818>Sekce (${ssrInterpolate(sections.value.length)})</h3><button type="button" class="btn btn-primary btn-sm" data-v-139b3818><i class="fa-solid fa-plus me-1" data-v-139b3818></i> Přidat sekci </button></div><!--[-->`);
        ssrRenderList(sections.value, (s, i) => {
          _push(`<div class="mb-3" data-v-139b3818>`);
          _push(ssrRenderComponent(SectionCard, {
            modelValue: sections.value[i],
            "onUpdate:modelValue": ($event) => sections.value[i] = $event,
            index: i,
            total: sections.value.length,
            onMoveUp: moveUp,
            onMoveDown: moveDown,
            onInsertBelow: insertBelow,
            onRemove: removeSection,
            "allow-remove-image": true
          }, null, _parent));
          if (props.mode === "edit" && s.imageUrl && !s.imageFile) {
            _push(`<label class="form-check mt-1" data-v-139b3818><input class="form-check-input" type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(s.removeImage) ? ssrLooseContain(s.removeImage, null) : s.removeImage) ? " checked" : ""} data-v-139b3818><span class="form-check-label" data-v-139b3818>Odebrat obrázek této sekce</span></label>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<hr class="my-3" data-v-139b3818></div>`);
        });
        _push(`<!--]--><div class="actions" data-v-139b3818><button class="btn btn-light border" data-v-139b3818>Zpět</button><button class="btn btn-primary"${ssrIncludeBooleanAttr(!sections.value.length) ? " disabled" : ""} data-v-139b3818>Pokračovat na „Výhody“</button></div></div>`);
      } else {
        _push(`<div class="form-grid full" data-v-139b3818><div class="d-flex align-items-center justify-content-between mb-2" data-v-139b3818><h3 class="mb-0 h6 fw-extrabold" data-v-139b3818>Tabulka výhod</h3></div>`);
        _push(ssrRenderComponent(FeaturesEditor, {
          modelValue: features.value,
          "onUpdate:modelValue": ($event) => features.value = $event
        }, null, _parent));
        _push(`<div class="actions" data-v-139b3818><button class="btn btn-light border" data-v-139b3818>Zpět</button><button class="btn btn-primary" data-v-139b3818>${ssrInterpolate(props.mode === "edit" ? "Uložit změny" : "Uložit")}</button></div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/ServiceForm.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const ServiceForm = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-139b3818"]]);
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServiceForm
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$o = {
  __name: "ServicesTable",
  __ssrInlineRender: true,
  props: {
    items: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const rows = computed(
      () => (props.items || []).map((s) => ({
        id: s.id,
        title: s.title || "",
        slug: s.slug || "",
        url: `/sluzby/${s.slug}`,
        previewUrl: `/admin/services/${s.id}/preview`,
        // náhled i pro nepublikované
        category: s.category || "—",
        published: !!s.is_published,
        createdAt: s.created_at ? new Date(s.created_at) : null,
        updatedAt: s.updated_at ? new Date(s.updated_at) : null
      }))
    );
    const pending = ref(/* @__PURE__ */ new Set());
    const isPending = (id) => pending.value.has(id);
    const deleting = ref(/* @__PURE__ */ new Set());
    function isDeleting(id) {
      return deleting.value.has(id);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card-wrap" }, _attrs))} data-v-9b0679ad><div class="card-head" data-v-9b0679ad><h3 class="title" data-v-9b0679ad>Stránky (služby)</h3><div class="meta muted" data-v-9b0679ad><strong data-v-9b0679ad>${ssrInterpolate(rows.value.length)}</strong> položek</div></div><div class="table-responsive" data-v-9b0679ad><table class="table align-middle" data-v-9b0679ad><thead data-v-9b0679ad><tr data-v-9b0679ad><th data-v-9b0679ad>Název</th><th data-v-9b0679ad>Kategorie</th><th style="${ssrRenderStyle({ "width": "160px" })}" data-v-9b0679ad>Publikovat</th><th style="${ssrRenderStyle({ "width": "168px" })}" data-v-9b0679ad>Akce</th></tr></thead><tbody data-v-9b0679ad><!--[-->`);
      ssrRenderList(rows.value, (r) => {
        _push(`<tr data-v-9b0679ad><td class="fw-800" data-v-9b0679ad><span class="name-pink" data-v-9b0679ad>${ssrInterpolate(r.title)}</span></td><td data-v-9b0679ad>${ssrInterpolate(r.category)}</td><td data-v-9b0679ad><label class="${ssrRenderClass([{ busy: isPending(r.id) }, "switch"])}"${ssrRenderAttr("title", r.published ? "Skrýt z webu" : "Zveřejnit na webu")} data-v-9b0679ad><input type="checkbox"${ssrIncludeBooleanAttr(r.published) ? " checked" : ""}${ssrIncludeBooleanAttr(isPending(r.id)) ? " disabled" : ""} aria-label="Přepnout publikaci" data-v-9b0679ad><span class="slider" data-v-9b0679ad></span></label></td><td data-v-9b0679ad><div class="actions" data-v-9b0679ad><a class="btn-ghost"${ssrRenderAttr("href", r.previewUrl)} target="_blank" rel="noopener" title="Náhled (admin)" data-v-9b0679ad><i class="fa-regular fa-eye" data-v-9b0679ad></i></a><a class="btn-ghost"${ssrRenderAttr("href", r.url)} target="_blank" rel="noopener" title="Otevřít veřejnou URL" data-v-9b0679ad><i class="fa-solid fa-arrow-up-right-from-square" data-v-9b0679ad></i></a>`);
        _push(ssrRenderComponent(unref(Link), {
          class: "btn-ghost",
          href: `/admin?view=edit&id=${r.id}`,
          title: "Upravit",
          "preserve-scroll": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fa-regular fa-pen-to-square" data-v-9b0679ad${_scopeId}></i>`);
            } else {
              return [
                createVNode("i", { class: "fa-regular fa-pen-to-square" })
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<button class="btn-ghost danger"${ssrIncludeBooleanAttr(isDeleting(r.id)) ? " disabled" : ""}${ssrRenderAttr("title", isDeleting(r.id) ? "Mažu…" : "Smazat")} data-v-9b0679ad><i class="fa-regular fa-trash-can" data-v-9b0679ad></i></button></div></td></tr>`);
      });
      _push(`<!--]-->`);
      if (rows.value.length === 0) {
        _push(`<tr data-v-9b0679ad><td colspan="4" class="text-center text-muted py-4" data-v-9b0679ad> Zatím žádné stránky. </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div>`);
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Admin/ServicesTable.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const ServicesTable = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-9b0679ad"]]);
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServicesTable
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$n = {
  __name: "Form",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const props = computed(() => {
      var _a;
      return ((_a = page.props) == null ? void 0 : _a.value) ?? page.props;
    });
    const showSuccess = ref(false);
    const showError = ref(false);
    const errorText = ref("");
    const currentQ = ref({ id: "", text: "" });
    const captchaInput = ref(null);
    const form = useForm({
      name: "",
      email: "",
      message: "",
      // antispam
      hp_field: "",
      captcha: "",
      captcha_qid: ""
    });
    async function fetchQuestion() {
      var _a;
      try {
        const { data } = await axios.get("/kontakt/captcha");
        currentQ.value = data;
        form.captcha_qid = data.id;
        form.captcha = "";
        await nextTick();
        const wantForm = typeof window !== "undefined" && window.location.hash === "#contact-form";
        if (wantForm) {
          (_a = captchaInput.value) == null ? void 0 : _a.focus({ preventScroll: true });
        }
      } catch (e) {
        flashError("Nepodařilo se načíst kontrolní otázku. Zkuste to prosím znovu.");
      }
    }
    function flashSuccess() {
      showError.value = false;
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
      }, 3500);
    }
    function flashError(message = "Odeslání se nezdařilo. Zkuste to prosím znovu.") {
      errorText.value = message;
      showSuccess.value = false;
      showError.value = true;
      setTimeout(() => {
        showError.value = false;
      }, 4e3);
    }
    function firstError(errors) {
      return (errors == null ? void 0 : errors.form) || (errors == null ? void 0 : errors.captcha) || (errors == null ? void 0 : errors.email) || (errors == null ? void 0 : errors.name) || (errors == null ? void 0 : errors.message) || "Formulář obsahuje chyby.";
    }
    watch(
      () => {
        var _a, _b;
        return (_b = (_a = props.value) == null ? void 0 : _a.flash) == null ? void 0 : _b.success;
      },
      (v) => {
        if (v) flashSuccess();
      }
    );
    watch(
      () => {
        var _a;
        return (_a = props.value) == null ? void 0 : _a.errors;
      },
      (errs) => {
        if (errs && Object.keys(errs).length) {
          flashError(firstError(errs));
          if (errs.captcha) fetchQuestion();
        }
      },
      { deep: true }
    );
    onMounted(() => {
      var _a;
      const p = props.value;
      const initialCaptcha = p == null ? void 0 : p.captcha;
      if (initialCaptcha == null ? void 0 : initialCaptcha.id) {
        currentQ.value = initialCaptcha;
        form.captcha_qid = initialCaptcha.id;
      } else {
        fetchQuestion();
      }
      if ((_a = p == null ? void 0 : p.flash) == null ? void 0 : _a.success) flashSuccess();
      if ((p == null ? void 0 : p.errors) && Object.keys(p.errors).length) {
        const errs = p.errors;
        flashError(firstError(errs));
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="notify-wrap" aria-live="polite" aria-atomic="true" data-v-e26f4b3e>`);
      if (showSuccess.value) {
        _push(`<div class="toast-notice" role="status" data-v-e26f4b3e><strong data-v-e26f4b3e>Hotovo</strong><div data-v-e26f4b3e>Děkujeme! Vaše zpráva byla odeslána.</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showError.value) {
        _push(`<div class="toast-error" role="alert" aria-live="assertive" data-v-e26f4b3e><strong data-v-e26f4b3e>Chyba</strong><div data-v-e26f4b3e>${ssrInterpolate(errorText.value)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><form id="contact-form" class="bg-white h-100 p-4 d-flex flex-column gap-3 rounded-3" novalidate data-v-e26f4b3e><div data-v-e26f4b3e><label for="contact-name" class="fw-bold mb-2" data-v-e26f4b3e>Jméno</label><input id="contact-name" name="name" type="text" class="${ssrRenderClass([{ "is-invalid": !!unref(form).errors.name }, "form-control bg-secondary py-2 px-3 w-100"])}" placeholder="Jan Novák" required autocomplete="name"${ssrRenderAttr("value", unref(form).name)} data-v-e26f4b3e>`);
      if (unref(form).errors.name) {
        _push(`<div class="invalid-feedback d-block" data-v-e26f4b3e>${ssrInterpolate(unref(form).errors.name)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-e26f4b3e><label for="contact-email" class="fw-bold mb-2" data-v-e26f4b3e>E-mailová adresa</label><input id="contact-email" name="email" type="email" class="${ssrRenderClass([{ "is-invalid": !!unref(form).errors.email }, "form-control bg-secondary py-2 px-3 w-100"])}" placeholder="uzivatel@domena.cz" required autocomplete="email"${ssrRenderAttr("value", unref(form).email)} data-v-e26f4b3e>`);
      if (unref(form).errors.email) {
        _push(`<div class="invalid-feedback d-block" data-v-e26f4b3e>${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-e26f4b3e><label for="contact-message" class="fw-bold mb-2" data-v-e26f4b3e>Zpráva</label><textarea id="contact-message" name="message" class="${ssrRenderClass([{ "is-invalid": !!unref(form).errors.message }, "form-control bg-secondary py-2 px-3 w-100"])}" placeholder="Zadejte svou zprávu…" rows="7" required data-v-e26f4b3e>${ssrInterpolate(unref(form).message)}</textarea>`);
      if (unref(form).errors.message) {
        _push(`<div class="invalid-feedback d-block" data-v-e26f4b3e>${ssrInterpolate(unref(form).errors.message)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><input type="text" name="hp_field" class="hp-field"${ssrRenderAttr("value", unref(form).hp_field)} autocomplete="off" tabindex="-1" aria-hidden="true" data-v-e26f4b3e><div data-v-e26f4b3e><label for="contact-captcha" class="fw-bold mb-2" data-v-e26f4b3e> Kontrolní otázka: ${ssrInterpolate(currentQ.value.text || "Načítám…")}</label><input id="contact-captcha" name="captcha" type="text" class="${ssrRenderClass([{ "is-invalid": !!unref(form).errors.captcha }, "form-control bg-secondary py-2 px-3 w-100"])}"${ssrRenderAttr("placeholder", currentQ.value.text ? "Zapište výsledek číslem" : "Načítám…")}${ssrIncludeBooleanAttr(!currentQ.value.id) ? " disabled" : ""} required inputmode="numeric"${ssrRenderAttr("value", unref(form).captcha)} data-v-e26f4b3e><input type="hidden" name="captcha_qid"${ssrRenderAttr("value", unref(form).captcha_qid)} data-v-e26f4b3e>`);
      if (unref(form).errors.captcha) {
        _push(`<div class="invalid-feedback d-block" data-v-e26f4b3e>${ssrInterpolate(unref(form).errors.captcha)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit" class="mt-auto btn btn-primary rounded-3 py-3"${ssrIncludeBooleanAttr(unref(form).processing || !currentQ.value.id) ? " disabled" : ""} data-v-e26f4b3e>`);
      if (unref(form).processing) {
        _push(`<span data-v-e26f4b3e>Odesílám…</span>`);
      } else {
        _push(`<span data-v-e26f4b3e>Odeslat zprávu</span>`);
      }
      _push(`</button></form><!--]-->`);
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Contact/Form.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const ContactForm = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-e26f4b3e"]]);
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ContactForm
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$m = {
  __name: "Content",
  __ssrInlineRender: true,
  props: {
    page: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const company = computed(() => {
      var _a, _b;
      return ((_b = (_a = props.page) == null ? void 0 : _a.data) == null ? void 0 : _b.company) ?? {};
    });
    const contacts = computed(() => {
      var _a, _b;
      return ((_b = (_a = props.page) == null ? void 0 : _a.data) == null ? void 0 : _b.contacts) ?? {};
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        "aria-labelledby": "contact-heading",
        class: "contact-section"
      }, _attrs))} data-v-c630f76a><div class="py-5" data-v-c630f76a><div class="container d-flex flex-column gap-2" data-v-c630f76a><h2 id="contact-heading" class="sr-only" data-v-c630f76a>Kontaktní údaje a formulář</h2><div class="d-flex flex-column flex-lg-row gap-3 justify-content-between" data-v-c630f76a><div class="col contact-info" data-v-c630f76a><section class="bg-secondary p-3 d-flex flex-column gap-3 mb-2 rounded-3" aria-labelledby="company-id-heading" data-v-c630f76a><h3 id="company-id-heading" class="fw-bold mb-2" data-v-c630f76a>Identifikační údaje</h3><p class="fw-bold mb-0" data-v-c630f76a>${ssrInterpolate(company.value.name || "IT Globe s.r.o. (OpenVPS)")}</p><div class="d-flex flex-wrap align-items-center gap-3" data-v-c630f76a><span class="bg-white px-3 py-2 rounded-3 d-inline-flex align-items-center" aria-hidden="true" data-v-c630f76a><i class="fa fa-arrow-right text-primary" data-v-c630f76a></i></span><p class="mb-0" data-v-c630f76a>IČ: ${ssrInterpolate(company.value.ic || "—")}</p></div><div class="d-flex flex-wrap align-items-center gap-3" data-v-c630f76a><span class="bg-white px-3 py-2 rounded-3 d-inline-flex align-items-center" aria-hidden="true" data-v-c630f76a><i class="fa fa-arrow-right text-primary" data-v-c630f76a></i></span><p class="mb-0" data-v-c630f76a>DIČ: ${ssrInterpolate(company.value.dic || "")}</p></div><div class="d-flex flex-wrap align-items-center gap-3" data-v-c630f76a><span class="bg-white px-3 py-2 rounded-3 d-inline-flex align-items-center" aria-hidden="true" data-v-c630f76a><i class="fa fa-arrow-right text-primary" data-v-c630f76a></i></span><p class="mb-0" data-v-c630f76a>${ssrInterpolate(company.value.registry || "")}</p></div></section><section class="bg-secondary p-3 d-flex flex-column gap-3 rounded-3" aria-labelledby="contacts-heading" data-v-c630f76a><h3 id="contacts-heading" class="fw-bold mb-2" data-v-c630f76a>Kontakty</h3><p class="fw-bold mb-0" data-v-c630f76a>${ssrInterpolate(contacts.value.note || "K dispozici 24/7")}</p><div class="bg-white p-2 rounded-3 d-flex flex-wrap align-items-center gap-3" data-v-c630f76a><span class="d-inline-flex" aria-hidden="true" data-v-c630f76a><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16" fill="none" focusable="false" aria-hidden="true" data-v-c630f76a><g clip-path="url(#clip0_2054_1428)" data-v-c630f76a><path d="M14.6663 6.66665V6.14497C14.6663 4.85189 14.6663 4.20536 14.2758 3.80365C13.8853 3.40194 13.2567 3.40194 11.9997 3.40194H10.6139C10.0023 3.40194 9.99727 3.40075 9.44734 3.12554L7.22627 2.01407C6.2989 1.55001 5.83522 1.31797 5.34126 1.3341C4.84729 1.35023 4.39885 1.61203 3.50197 2.13565L2.68339 2.61356C2.0246 2.99817 1.6952 3.19049 1.5141 3.51041C1.33301 3.83033 1.33301 4.21993 1.33301 4.99913V10.4771C1.33301 11.5009 1.33301 12.0128 1.56118 12.2978C1.71301 12.4873 1.92578 12.6148 2.16101 12.657C2.51451 12.7205 2.94733 12.4678 3.81292 11.9624C4.40071 11.6193 4.96641 11.2629 5.66959 11.3596C6.2588 11.4405 6.80634 11.8123 7.33301 12.0758" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-c630f76a></path><path d="M5.33301 1.33331V11.3333" stroke="#F52130" stroke-width="1.5" stroke-linejoin="round" data-v-c630f76a></path><path d="M10 3.33331V6.33331" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-c630f76a></path><path d="M12.2059 14.4557C12.0613 14.591 11.8681 14.6667 11.6671 14.6667C11.466 14.6667 11.2728 14.591 11.1283 14.4557C9.80452 13.2087 8.03066 11.8157 8.89572 9.7932C9.36346 8.69973 10.4863 8 11.6671 8C12.8479 8 13.9707 8.69973 14.4384 9.7932C15.3024 11.8131 13.5329 13.2129 12.2059 14.4557Z" stroke="#F52130" stroke-width="1.5" data-v-c630f76a></path><path d="M11.667 11H11.673" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-c630f76a></path></g><defs data-v-c630f76a><clipPath id="clip0_2054_1428" data-v-c630f76a><rect width="16" height="16" fill="white" data-v-c630f76a></rect></clipPath></defs></svg></span><p class="mb-0" data-v-c630f76a>${ssrInterpolate(contacts.value.address || "Orlické Podhůří 30, 562 01 Ústí nad Orlicí")}</p></div><div class="bg-white p-2 rounded-3 d-flex flex-wrap align-items-center gap-3" data-v-c630f76a><span class="d-inline-flex" aria-hidden="true" data-v-c630f76a><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16" fill="none" focusable="false" aria-hidden="true" data-v-c630f76a><g clip-path="url(#clip0_2054_1443)" data-v-c630f76a><path d="M4.33301 6H5.66634" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-c630f76a></path><path d="M11.667 5.33331V2.66665C11.667 1.93027 12.2639 1.33331 13.0003 1.33331" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-c630f76a></path><path d="M8.33301 12V14.6667" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" data-v-c630f76a></path><path d="M11.667 3.43924C11.0237 3.33331 10.1731 3.33331 8.91699 3.33331H7.08366C5.13813 3.33331 4.16537 3.33331 3.42901 3.72691C2.84758 4.03769 2.37137 4.5139 2.06059 5.09533C1.66699 5.83169 1.66699 6.80445 1.66699 8.74998C1.66699 9.91731 1.66699 10.501 1.90315 10.9428C2.08962 11.2916 2.37535 11.5774 2.7242 11.7638C3.16602 12 3.74968 12 4.91699 12H11.0837C12.251 12 12.8347 12 13.2765 11.7638C13.6253 11.5774 13.9111 11.2916 14.0975 10.9428C14.3337 10.501 14.3337 9.91731 14.3337 8.74998C14.3337 6.80445 14.3337 5.83169 13.9401 5.09533C13.8241 4.87835 13.6851 4.67602 13.5261 4.49148" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" data-v-c630f76a></path><path d="M8.33341 12V7.33334C8.33341 6.714 8.33341 6.40433 8.29234 6.14522C8.06647 4.71891 6.94781 3.60028 5.52151 3.37437C5.46694 3.36573 5.41011 3.3589 5.34863 3.35352" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" data-v-c630f76a></path></g><defs data-v-c630f76a><clipPath id="clip0_2054_1443" data-v-c630f76a><rect width="16" height="16" fill="white" data-v-c630f76a></rect></clipPath></defs></svg></span><p class="mb-0" data-v-c630f76a><a class="text-primary text-decoration-underline"${ssrRenderAttr("href", contacts.value.email ? `mailto:${contacts.value.email}` : "mailto:info@openvps.cz")} data-v-c630f76a>${ssrInterpolate(contacts.value.email || "info@openvps.cz")}</a></p></div><div class="bg-white p-2 rounded-3 d-flex flex-wrap align-items-center gap-3" data-v-c630f76a><span class="d-inline-flex" aria-hidden="true" data-v-c630f76a><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16" fill="none" focusable="false" aria-hidden="true" data-v-c630f76a><path d="M6.1055 3.80815L5.83707 3.20417C5.66155 2.80925 5.57379 2.61179 5.44254 2.46067C5.27805 2.27129 5.06364 2.13196 4.82378 2.05857C4.63239 2 4.4163 2 3.98414 2C3.35194 2 3.03584 2 2.77048 2.12153C2.45791 2.26468 2.17562 2.57552 2.06315 2.9004C1.96767 3.17619 1.99502 3.45962 2.04972 4.02647C2.63194 10.0601 5.93988 13.3681 11.9735 13.9503C12.5404 14.005 12.8238 14.0323 13.0996 13.9369C13.4245 13.8244 13.7353 13.5421 13.8785 13.2295C14 12.9641 14 12.6481 14 12.0159C14 11.5837 14 11.3676 13.9414 11.1762C13.868 10.9363 13.7287 10.7219 13.5393 10.5575C13.3882 10.4262 13.1908 10.3385 12.7958 10.1629L12.1918 9.89447C11.7642 9.7044 11.5503 9.6094 11.333 9.58873C11.125 9.56893 10.9154 9.59813 10.7207 9.67393C10.5173 9.75313 10.3376 9.90293 9.97797 10.2025C9.6201 10.5008 9.44117 10.6499 9.2225 10.7298C9.02864 10.8006 8.77237 10.8269 8.56824 10.7967C8.3379 10.7628 8.16157 10.6686 7.80884 10.4801C6.7115 9.89367 6.10635 9.28853 5.51991 8.19113C5.33143 7.83847 5.23718 7.66207 5.20324 7.4318C5.17316 7.2276 5.19938 6.97133 5.2702 6.77753C5.35008 6.55885 5.49921 6.37991 5.79746 6.022C6.09708 5.66245 6.24689 5.48268 6.3261 5.27927C6.4019 5.08463 6.43108 4.87493 6.4113 4.66699C6.39063 4.44968 6.29558 4.23584 6.1055 3.80815Z" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" data-v-c630f76a></path></svg></span><p class="mb-0" data-v-c630f76a><a class="text-primary text-decoration-underline"${ssrRenderAttr("href", `tel:${(contacts.value.phone || "+420 733 482 481").replace(/\\s+/g, "")}`)} data-v-c630f76a>${ssrInterpolate(contacts.value.phone || "+420 733 482 481")}</a></p></div></section></div><div class="col" data-v-c630f76a>`);
      _push(ssrRenderComponent(ContactForm, null, null, _parent));
      _push(`</div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Contact/Content.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const ContactContent = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-c630f76a"]]);
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ContactContent
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$l = {
  __name: "Hero",
  __ssrInlineRender: true,
  props: { page: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const hero = computed(() => {
      var _a, _b;
      return ((_b = (_a = props.page) == null ? void 0 : _a.data) == null ? void 0 : _b.hero) ?? {};
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "contact-hero text-center text-white",
        style: {
          backgroundImage: hero.value.image ? `url(${hero.value.image})` : void 0,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative"
          // kvůli overlay
        }
      }, _attrs))}><div class="overlay" style="${ssrRenderStyle({ "position": "absolute", "inset": "0" })}"></div><div style="${ssrRenderStyle({ "position": "relative", "z-index": "1" })}"><h1 class="contact-hero__title">${ssrInterpolate(hero.value.title || "Kontaktujte nás")}</h1><p class="contact-hero__lead">${ssrInterpolate(hero.value.subtitle || "Neváhejte nás kontaktovat – jsme tu pro vás 24/7.")}</p><a href="#contact-form" class="contact-hero__cta">Napište nám</a></div></section>`);
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Contact/Hero.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$l
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$k = {
  __name: "Map",
  __ssrInlineRender: true,
  props: { page: { type: Object, required: true } },
  setup(__props) {
    const props = __props;
    const mapUrl = computed(() => {
      var _a, _b, _c;
      return ((_c = (_b = (_a = props.page) == null ? void 0 : _a.data) == null ? void 0 : _b.map) == null ? void 0 : _c.embed) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        "aria-labelledby": "map-heading",
        class: "py-4"
      }, _attrs))}><div class="container d-flex flex-column gap-2 text-center text-md-start"><h2 id="map-heading" class="sr-only">Naše poloha na mapě</h2><div class="bg-white p-3 rounded-3">`);
      if (mapUrl.value) {
        _push(`<iframe class="rounded-3"${ssrRenderAttr("src", mapUrl.value)} width="100%" height="450" style="${ssrRenderStyle({ "border": "0" })}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Sídlo společnosti IT Globe s.r.o."></iframe>`);
      } else {
        _push(`<p class="mb-0 text-muted">Mapa není k dispozici.</p>`);
      }
      _push(`</div></div></section>`);
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Contact/Map.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$k
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$j = {
  __name: "About",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "about" }, _attrs))}><div class="container bg-white p-4 p-md-5 rounded-3"><div class="d-flex flex-column flex-lg-row gap-5 justify-content-between align-items-center"><div class="col d-flex flex-column"><p class="about-subtitle">IT Globe</p><h2 class="about-title">Komplexní hostingové služby</h2><p class="about-paragraph"> Potřebujete se věnovat podnikání a nemáte k tomu vhodné IT zázemí? Postaráme se o infrastrukturu i provoz — od rychlých VPS a správy serverů přes kontejnery až po firemní aplikace a dohled 24/7. Najdeme pro vás nejvhodnější řešení. </p></div><div class="col d-flex flex-column gap-3"><img${ssrRenderAttr("src", "/images/home/about.jpg")} alt="IT Globe – tým a infrastruktura" class="img-fluid rounded-3 object-fit-cover" loading="lazy"></div></div></div></section>`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Home/About.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const __vite_glob_0_23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$j
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$i = {
  __name: "Companies",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "text-center pt-5 refs" }, _attrs))}><div class="container"><h2 class="fw-bold mb-5">Dodáváme řešení pro přední společnosti</h2><ul class="d-flex gap-5 flex-wrap justify-content-center list-unstyled m-0"><li><img class="grayed-out"${ssrRenderAttr("src", "/images/home/client-logo1.svg")} alt="Client Logo 1" height="30" loading="lazy"></li><li><img class="grayed-out"${ssrRenderAttr("src", "/images/home/client-logo2.svg")} alt="Client Logo 2" height="30" loading="lazy"></li><li><img class="grayed-out"${ssrRenderAttr("src", "/images/home/client-logo3.svg")} alt="Client Logo 3" height="30" loading="lazy"></li><li><img class="grayed-out"${ssrRenderAttr("src", "/images/home/client-logo4.svg")} alt="Client Logo 4" height="30" loading="lazy"></li><li><img class="grayed-out"${ssrRenderAttr("src", "/images/home/client-logo5.svg")} alt="Client Logo 5" height="30" loading="lazy"></li></ul></div></section>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Home/Companies.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const __vite_glob_0_24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$i
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$h = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "drives" }, _attrs))}><div class="container drives__container"><div class="drives__content"><header class="drives__header"><h2 class="drives-title">Co nás pohání</h2><p class="drives-subtitle">Zajišťujeme komplexní hostingové služby. Najdeme pro vás nejvhodnější řešení.</p></header><article class="drives-item"><h3 class="h4 m-0">Kompletní správa</h3><p> Zajišťujeme správu serverů a sítě na vysoké úrovni. </p><div class="drives-icons"><div class="icon1" title="GitHub" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" role="img" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></div><div class="icon1" title="GitHub" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" role="img" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></div><div class="icon1" title="GitHub" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" role="img" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></div><div class="icon1" title="GitHub" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" role="img" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></div></div></article><article class="drives-item"><h3 class="h4 m-0">Maximální spolehlivost</h3><p> Díky vlastnímu datacentru nabízíme vysokou dostupnost i bezpečnost. </p><div class="drives-icons"><div class="icon1" title="GitHub" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" role="img" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></div><div class="icon1" title="GitHub" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" role="img" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></div><div class="icon1" title="GitHub" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" role="img" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></div><div class="icon1" title="GitHub" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" role="img" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></div></div></article></div><aside class="testimonial-box bg-about"><div class="quote-box"><p class="quote-text">„Jakou zkušenost mají naši klienti? Dělají s námi skvělé věci.“</p><p class="quote-author mb-0">— ITGlobe</p></div></aside></div></section>`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Home/Drives.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const DrivesSection = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$2]]);
const __vite_glob_0_25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DrivesSection
}, Symbol.toStringTag, { value: "Module" }));
const desktopImg = "/images/home_hero.jpg";
const mobileImg = "/images/home_hero_mobile.jpg";
const _sfc_main$g = {
  __name: "Hero",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero" }, _attrs))} data-v-1ab9ea0e><picture data-v-1ab9ea0e><source media="(max-width: 576px)"${ssrRenderAttr("srcset", mobileImg)} sizes="100vw" data-v-1ab9ea0e><source media="(min-width: 577px)"${ssrRenderAttr("srcset", desktopImg)} sizes="100vw" data-v-1ab9ea0e><img class="hero-bg"${ssrRenderAttr("src", desktopImg)} alt="" role="presentation" decoding="async" fetchpriority="high" data-v-1ab9ea0e></picture><div class="overlay" data-v-1ab9ea0e><div class="container d-flex flex-column gap-2 text-center text-white" data-v-1ab9ea0e><div data-v-1ab9ea0e><h1 class="display-3 text-white fw-bold" data-v-1ab9ea0e>Výkonná IT infrastruktura</h1><p class="fs-5 mb-4" data-v-1ab9ea0e> VPS, Kubernetes i správa serverů se SLA a dohledem 24/7. <br data-v-1ab9ea0e> Vysoká dostupnost, žádné kompromisy. </p><div data-v-1ab9ea0e><a class="btn btn-primary rounded-3 p-3 px-5" href="#quote" data-v-1ab9ea0e>Nezávazně poptat</a></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Home/Hero.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-1ab9ea0e"]]);
const __vite_glob_0_26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: HeroSection
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$f = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "services" }, _attrs))}><div class="container d-flex flex-column gap-2"><div class="col-md-7 mx-auto text-center mb-4"><h2 class="section-title">Výkonná IT infrastruktura pro náročné</h2><p class="section-desc"> Naše služby pomáhají firmám ve výrobě, obchodu i službách fungovat spolehlivě, bezpečně a bez výpadků. </p></div><div class="row g-2 row-cols-1 row-cols-sm-2"><div class="col"><article class="service-card"><h3 class="service-card__title">VPS servery</h3><p class="service-card__desc"> Bleskově rychlé virtuální servery s okamžitým nasazením, plným root přístupem a škálováním pro rostoucí byznys. </p><div><button class="btn-ghost-accent">Zjistit více</button></div><img${ssrRenderAttr("src", "/images/home/services_vps.png")} alt="VPS servery" class="service-card__image" loading="lazy"></article></div><div class="col"><article class="service-card"><h3 class="service-card__title">Managed servery</h3><p class="service-card__desc"> Managed servery s nepřetržitým monitoringem, aktualizacemi a technickým dohledem. </p><div><button class="btn-ghost-accent">Zjistit více</button></div><img${ssrRenderAttr("src", "/images/home/services_managed.jpg")} alt="Spravované servery" class="service-card__image" loading="lazy"></article></div><div class="col"><article class="service-card"><h3 class="service-card__title">Kubernetes</h3><p class="service-card__desc"> Orchestrace kontejnerových aplikací, nasazování, škálování a správa prostředí včetně CI/CD. </p><div><button class="btn-ghost-accent">Zjistit více</button></div><img${ssrRenderAttr("src", "/images/home/services_kubernetes.jpg")} alt="Služby Kubernetes" class="service-card__image" loading="lazy"></article></div><div class="col"><article class="service-card"><h3 class="service-card__title">Aplikace</h3><p class="service-card__desc"> Firemní aplikace včetně hostingu, vývoje a správy – bezpečně a bez starostí. </p><div><button class="btn-ghost-accent">Zjistit více</button></div><img${ssrRenderAttr("src", "/images/home/services_application.png")} alt="Firemní aplikace" class="service-card__image" loading="lazy"></article></div></div></div></section>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Home/Services.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const ServicesSection = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$1]]);
const __vite_glob_0_27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServicesSection
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$e = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "why" }, _attrs))}><div class="container d-flex flex-column gap-2"><div class="col-md-7 mx-auto text-center mb-4"><h2>Proč zvolit zrovna nás?</h2><p>Bez váhání Vám připravíme řešení na míru nebo s Vámi vyřešíme jakýkoliv technický problém.</p></div><div class="row g-2 row-cols-1 row-cols-sm-2"><div class="col"><article class="feature-card h-100 rounded-3 p-4 d-flex flex-column"><div class="why-iconbox mb-3" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none"><g clip-path="url(#clip0_26_260)"><path d="M8.876 21.8334C5.44666 21.8334 2.66666 19.1574 2.66666 15.8561C2.66666 12.5561 5.44666 9.88009 8.876 9.88009C9.4 7.53076 11.268 5.61342 13.776 4.84942C16.2827 4.08676 19.0507 4.59209 21.0347 6.18276C23.0187 7.76942 23.9173 10.1921 23.3947 12.5414H24.7147C27.2653 12.5414 29.3333 14.6214 29.3333 17.1894C29.3333 19.7588 27.2653 21.8388 24.7133 21.8388H8.876" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 21.8333V28.4999" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21.3333 21.8333V27.1666C21.3333 27.5202 21.4738 27.8593 21.7239 28.1094C21.9739 28.3594 22.313 28.4999 22.6667 28.4999H28" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.6667 21.8333V27.1666C10.6667 27.5202 10.5262 27.8593 10.2761 28.1094C10.0261 28.3594 9.68695 28.4999 9.33333 28.4999H4" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_26_260"><rect width="32" height="32" fill="white" transform="translate(0 0.5)"></rect></clipPath></defs></svg></div><h3 class="fw-bold h4 mb-2">Kompletní správa</h3><p>Zajišťujeme správu serverů a sítě na vysoké úrovni</p></article></div><div class="col"><article class="feature-card h-100 rounded-3 p-4 d-flex flex-column"><div class="why-iconbox mb-3" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none"><g clip-path="url(#clip0_26_272)"><path d="M25.3334 24.4999C26.571 24.4999 27.758 24.0082 28.6332 23.1331C29.5084 22.2579 30 21.0709 30 19.8332C30 18.5955 29.5084 17.4086 28.6332 16.5334C27.758 15.6582 26.571 15.1666 25.3334 15.1666H24C24.5294 12.8092 23.62 10.3759 21.616 8.78389C19.612 7.19322 16.816 6.68389 14.2827 7.45056C11.7494 8.21722 9.8627 10.1426 9.33336 12.4999C6.40136 12.3826 3.79336 14.2679 3.11203 16.9972C2.42936 19.7266 3.86403 22.5359 6.53336 23.6999" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10.6667 21.8333C10.6667 21.4797 10.8072 21.1406 11.0572 20.8905C11.3073 20.6405 11.6464 20.5 12 20.5H20C20.3536 20.5 20.6928 20.6405 20.9428 20.8905C21.1929 21.1406 21.3334 21.4797 21.3334 21.8333V25.8333C21.3334 26.187 21.1929 26.5261 20.9428 26.7761C20.6928 27.0262 20.3536 27.1667 20 27.1667H12C11.6464 27.1667 11.3073 27.0262 11.0572 26.7761C10.8072 26.5261 10.6667 26.187 10.6667 25.8333V21.8333Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.3333 20.5001V17.8334C13.3333 17.1262 13.6143 16.4479 14.1144 15.9478C14.6145 15.4477 15.2927 15.1667 16 15.1667C16.7072 15.1667 17.3855 15.4477 17.8856 15.9478C18.3857 16.4479 18.6666 17.1262 18.6666 17.8334V20.5001" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_26_272"><rect width="32" height="32" fill="white" transform="translate(0 0.5)"></rect></clipPath></defs></svg></div><h3 class="fw-bold h4 mb-2">Maximální spolehlivost</h3><p>Díky vlastnímu datacentru nabízíme vysokou dostupnost i bezpečnost</p></article></div><div class="col"><article class="feature-card h-100 rounded-3 p-4 d-flex flex-column"><div class="why-iconbox mb-3" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none"><g clip-path="url(#clip0_26_284)"><path d="M4 9.83325C4 8.77239 4.42143 7.75497 5.17157 7.00482C5.92172 6.25468 6.93913 5.83325 8 5.83325H24C25.0609 5.83325 26.0783 6.25468 26.8284 7.00482C27.5786 7.75497 28 8.77239 28 9.83325V12.4999C28 13.5608 27.5786 14.5782 26.8284 15.3283C26.0783 16.0785 25.0609 16.4999 24 16.4999H8C6.93913 16.4999 5.92172 16.0785 5.17157 15.3283C4.42143 14.5782 4 13.5608 4 12.4999V9.83325Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 20.5C4 19.4391 4.42143 18.4217 5.17157 17.6716C5.92172 16.9214 6.93913 16.5 8 16.5H24C25.0609 16.5 26.0783 16.9214 26.8284 17.6716C27.5786 18.4217 28 19.4391 28 20.5V23.1667C28 24.2275 27.5786 25.2449 26.8284 25.9951C26.0783 26.7452 25.0609 27.1667 24 27.1667H8C6.93913 27.1667 5.92172 26.7452 5.17157 25.9951C4.42143 25.2449 4 24.2275 4 23.1667V20.5Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.33334 11.1667V11.1801" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.33334 21.8333V21.8466" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_26_284"><rect width="32" height="32" fill="white" transform="translate(0 0.5)"></rect></clipPath></defs></svg></div><h3 class="fw-bold h4 mb-2">Vysoký výkon a stabilita</h3><p>V našem datacentru využíváme kvalitní hardware předních výrobců HP a Dell. Datová úložiště jsou typu HP 3PAR</p></article></div><div class="col"><article class="feature-card h-100 rounded-3 p-4 d-flex flex-column"><div class="why-iconbox mb-3" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none"><g clip-path="url(#clip0_26_296)"><path d="M24 5.83325C25.0609 5.83325 26.0783 6.25468 26.8284 7.00482C27.5786 7.75497 28 8.77239 28 9.83325V20.4999C28 21.5608 27.5786 22.5782 26.8284 23.3283C26.0783 24.0785 25.0609 24.4999 24 24.4999H17.3333L10.6667 28.4999V24.4999H8C6.93913 24.4999 5.92172 24.0785 5.17157 23.3283C4.42143 22.5782 4 21.5608 4 20.4999V9.83325C4 8.77239 4.42143 7.75497 5.17157 7.00482C5.92172 6.25468 6.93913 5.83325 8 5.83325H24Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.6667 12.5H12.68" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.3333 12.5H19.3466" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.6667 17.8333C13.1012 18.2767 13.6198 18.629 14.1922 18.8695C14.7646 19.11 15.3792 19.2339 16 19.2339C16.6209 19.2339 17.2355 19.11 17.8079 18.8695C18.3802 18.629 18.8988 18.2767 19.3334 17.8333" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_26_296"><rect width="32" height="32" fill="white" transform="translate(0 0.5)"></rect></clipPath></defs></svg></div><h3 class="fw-bold h4 mb-2">24/7 podpora</h3><p>Naši odborníci jsou Vám k dispozici kdykoliv je potřeba</p></article></div><div class="col"><article class="feature-card h-100 rounded-3 p-4 d-flex flex-column"><div class="why-iconbox mb-3" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none"><g clip-path="url(#clip0_26_309)"><path d="M16 21.8333H5.33333C4.97971 21.8333 4.64057 21.6928 4.39052 21.4427C4.14048 21.1927 4 20.8535 4 20.4999V7.16659C4 6.81296 4.14048 6.47383 4.39052 6.22378C4.64057 5.97373 4.97971 5.83325 5.33333 5.83325H26.6667C27.0203 5.83325 27.3594 5.97373 27.6095 6.22378C27.8595 6.47383 28 6.81296 28 7.16659V16.4999" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.33334 27.1667H16" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 21.8333V27.1666" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22.668 25.8334C22.668 26.5407 22.949 27.2189 23.449 27.719C23.9491 28.2191 24.6274 28.5001 25.3347 28.5001C26.0419 28.5001 26.7202 28.2191 27.2203 27.719C27.7204 27.2189 28.0013 26.5407 28.0013 25.8334C28.0013 25.1262 27.7204 24.4479 27.2203 23.9478C26.7202 23.4477 26.0419 23.1667 25.3347 23.1667C24.6274 23.1667 23.9491 23.4477 23.449 23.9478C22.949 24.4479 22.668 25.1262 22.668 25.8334Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M25.3347 21.1667V23.1667" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M25.3347 28.5V30.5" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M29.376 23.5L27.644 24.5" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M23.0267 27.1667L21.2933 28.1667" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21.2933 23.5L23.0267 24.5" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.644 27.1667L29.3773 28.1667" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_26_309"><rect width="32" height="32" fill="white" transform="translate(0 0.5)"></rect></clipPath></defs></svg></div><h3 class="fw-bold h4 mb-2">Správa serveru odkudkoliv</h3><p>Ke svému serveru získáváte plný přístup přes SSH a VNC skrze náš portál</p></article></div><div class="col"><article class="feature-card h-100 rounded-3 p-4 d-flex flex-column"><div class="why-iconbox mb-3" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none"><g clip-path="url(#clip0_26_327)"><path d="M16 4.5C19.1144 7.25543 23.1793 8.69009 27.3333 8.5C27.9381 10.5574 28.1232 12.7153 27.8775 14.8456C27.6318 16.9759 26.9604 19.035 25.9032 20.9007C24.846 22.7664 23.4245 24.4005 21.7233 25.706C20.022 27.0114 18.0757 27.9616 16 28.5C13.9243 27.9616 11.978 27.0114 10.2767 25.706C8.57548 24.4005 7.15402 22.7664 6.0968 20.9007C5.03958 19.035 4.36818 16.9759 4.1225 14.8456C3.87683 12.7153 4.06188 10.5574 4.66667 8.5C8.82071 8.69009 12.8856 7.25543 16 4.5Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.6667 15.1666C14.6667 15.5202 14.8072 15.8593 15.0572 16.1094C15.3073 16.3594 15.6464 16.4999 16 16.4999C16.3536 16.4999 16.6928 16.3594 16.9428 16.1094C17.1929 15.8593 17.3334 15.5202 17.3334 15.1666C17.3334 14.813 17.1929 14.4738 16.9428 14.2238C16.6928 13.9737 16.3536 13.8333 16 13.8333C15.6464 13.8333 15.3073 13.9737 15.0572 14.2238C14.8072 14.4738 14.6667 14.813 14.6667 15.1666Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 16.5V19.8333" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_26_327"><rect width="32" height="32" fill="white" transform="translate(0 0.5)"></rect></clipPath></defs></svg></div><h3 class="fw-bold h4 mb-2">Bezpečnost</h3><p>Servery jsou chráněny chytrými firewally proti DDoS a jiným útokům ze sítě internet</p></article></div></div></div></section>`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Home/Why.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const WhySection = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender]]);
const __vite_glob_0_28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: WhySection
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$d = {
  __name: "ContactAction",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-5 contact-action" }, _attrs))}><div class="container d-flex flex-column gap-2 text-center text-md-start"><div class="col-md-10 mx-auto text-center py-5 bg-cta-grad px-4 text-white rounded-4"><div class="opacity-75 mb-2">Přidejte se k těmto úspěšným značkám</div><div class="d-flex gap-2 justify-content-center mb-3 ref-badges" aria-label="Reference"><span class="logo-tile" role="img" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"></path></svg></span><span class="logo-tile" role="img" aria-label="Vercel"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false"><polygon points="12,3 22,21 2,21"></polygon></svg></span><span class="logo-tile" role="img" aria-label="Slack"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false"><rect x="2" y="7" width="20" height="3.5" rx="1.75"></rect><rect x="2" y="13.5" width="20" height="3.5" rx="1.75"></rect><rect x="7" y="2" width="3.5" height="20" rx="1.75"></rect><rect x="13.5" y="2" width="3.5" height="20" rx="1.75"></rect></svg></span><span class="logo-tile" role="img" aria-label="Spotify"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9.5"></circle><path d="M6.5 9.25c3.5-1.15 7.5-1.05 10.9.35" vector-effect="non-scaling-stroke"></path><path d="M7 12.2c2.8-.85 5.8-.75 8.4.25" vector-effect="non-scaling-stroke"></path><path d="M7.5 14.9c2.1-.65 4.2-.55 6 .25" vector-effect="non-scaling-stroke"></path></svg></span></div><h2 class="fs-1 fw-bold mb-1">Chcete posunout své IT dál?</h2><p class="opacity-75 mb-4">Kontaktujte nás a společně najdeme ideální řešení pro váš byznys.</p><div><a class="btn-cta" href="#quote">Kontaktujte nás</a></div></div></div></section>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/References/ContactAction.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const __vite_glob_0_29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = {
  __name: "Hero",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "references-hero" }, _attrs))} data-v-04cda078><div class="overlay" data-v-04cda078><div class="container text-center text-white" data-v-04cda078><h1 class="display-4 fw-bold mb-3" data-v-04cda078>Naše reference</h1><p class="fs-5 m-auto" style="${ssrRenderStyle({ "max-width": "820px" })}" data-v-04cda078> Podívejte se, jak pomáháme firmám růst díky spolehlivé infrastruktuře. <br data-v-04cda078> Cloud, spravované servery a kontejnery – vše na míru a bez starostí. </p></div></div></section>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/References/Hero.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const ReferencesHero = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-04cda078"]]);
const __vite_glob_0_30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ReferencesHero
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = {
  __name: "Partners",
  __ssrInlineRender: true,
  props: {
    items: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const cards = computed(
      () => (props.items || []).map((r) => ({
        id: r.id ?? null,
        logo: r.logo ?? "",
        alt: r.logo_alt || (r.title ? `Logo klienta – ${r.title}` : "Logo klienta"),
        title: r.title ?? "",
        desc: r.description ?? "",
        tag: r.tag ?? ""
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-5" }, _attrs))} data-v-fb210839><div class="container" data-v-fb210839><div class="col-md-7 mx-auto text-center mb-4" data-v-fb210839><h2 class="section-title" data-v-fb210839>Naši partneři</h2><p class="section-desc" data-v-fb210839>Podívejte se, jak jsme pomohli našim partnerům se správou jejich infrastruktury.</p></div>`);
      if (cards.value.length) {
        _push(`<div class="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3" data-v-fb210839><!--[-->`);
        ssrRenderList(cards.value, (c) => {
          _push(`<div class="col" data-v-fb210839><article class="bg-gray h-100 rounded-3 p-4 d-flex flex-column gap-3" data-v-fb210839><div class="d-flex align-items-center justify-content-center bg-white rounded-3 logo-wrap" data-v-fb210839><img${ssrRenderAttr("src", c.logo)}${ssrRenderAttr("alt", c.alt)} class="img-fluid grayed-out" loading="lazy" data-v-fb210839></div><h4 class="fw-bold mb-0" data-v-fb210839>${ssrInterpolate(c.title)}</h4>`);
          if (c.desc) {
            _push(`<p class="mb-0" data-v-fb210839>${ssrInterpolate(c.desc)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (c.tag) {
            _push(`<button class="mt-auto btn btn-light text-danger text-start" data-v-fb210839>${ssrInterpolate(c.tag)}</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</article></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center text-muted py-4" data-v-fb210839> Zatím žádné reference. </div>`);
      }
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/References/Partners.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const Partners = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-fb210839"]]);
const __vite_glob_0_31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Partners
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$a = {
  __name: "ReferencesHero",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "references-hero" }, _attrs))}><div class="overlay"><div class="container text-center text-white"><h1 class="display-4 fw-bold mb-3">Naše reference</h1><p class="fs-5 m-auto" style="${ssrRenderStyle({ "max-width": "820px" })}"> Podívejte se, jak pomáháme firmám růst díky spolehlivé infrastruktuře. <br> Cloud, spravované servery a kontejnery – vše na míru a bez starostí. </p></div></div></section>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/References/ReferencesHero.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __vite_glob_0_32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = {
  __name: "Features",
  __ssrInlineRender: true,
  props: {
    heading: { type: String, default: "Benefity" },
    items: { type: [Array, Object, String], default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const ICONS = {
      server: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
      gauge: `<svg viewBox="0 -960 960 960"><path fill="currentColor" d="M120-160v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80-440v-160h720v160H120Zm80-40h80v-80h-80v80Zm-80 280v-160h720v160H120Zm80-40h80v-80h-80v80Z"/></svg>`,
      docker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18v4a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7v-4Z"/><path d="M7 10V6h4v4m0-4v4m4-4v4m0-4h4v4"/></svg>`,
      k8s: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2.2 15.5 5v10L10 17.8 4.5 15V5L10 2.2z"/><path d="M10 5v10M5.8 7.5l8.4 5M14.2 7.5l-8.4 5"/></svg>`,
      gitBranch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M15 6a3 3 0 0 1-3 3H6"/></svg>`,
      pipeline: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="4.5" cy="10" r="1.7"/><circle cx="10" cy="10" r="1.7"/><circle cx="15.5" cy="10" r="1.7"/><path d="M6.2 10h2.1M11.7 10h2.1"/></svg>`,
      layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 22 8.5 12 15 2 8.5 12 2"/><polyline points="2 17 12 23 22 17"/></svg>`,
      app: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1.2"/><rect x="11" y="3" width="6" height="6" rx="1.2"/><rect x="3" y="11" width="6" height="6" rx="1.2"/><rect x="11" y="11" width="6" height="6" rx="1.2"/></svg>`,
      code: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 6.5 4 10l3.5 3.5M12.5 6.5 16 10l-3.5 3.5"/></svg>`,
      cloudUpload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16l-4-4-4 4"/><path d="M12 12v9"/><path d="M20.39 18.39A9 9 0 1 0 3 12h1.26"/></svg>`,
      move: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="5" height="9" rx="1.2"/><rect x="12.5" y="5.5" width="5" height="9" rx="1.2"/><path d="M6.5 8H14.5"/><path d="M14.5 8l-2-2M14.5 8l-2 2"/><path d="M14.5 12H6.5"/><path d="M6.5 12l2-2M6.5 12l2 2"/></svg>`,
      shield: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M10 18c4.5-2 7-4.5 7-9.5V4.7c0-.4-.3-.7-.7-.8C13.7 3.4 12 2.9 10 2 8 2.9 6.3 3.4 3.7 3.9c-.4.1-.7.4-.7.8V8.5C3 13.5 5.5 16 10 18z"/></svg>`,
      bolt: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 1.75 4.5 10.25h4l-1 8 6-8h-4l1-6.5z"/></svg>`,
      gear: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="2.5"/><path d="M10 2.8v2.2M10 15v2.2M2.8 10H5M15 10h2.2M4.4 4.4l1.6 1.6M14 14l1.6 1.6M15.6 4.4 14 6M6 14l-1.6 1.6"/></svg>`,
      cloud: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 15.5h7.5a3.5 3.5 0 1 0-.6-6.9 4.5 4.5 0 0 0-8.8 1.4A3.2 3.2 0 0 0 6.5 15.5z"/></svg>`,
      database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"/></svg>`,
      network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>`,
      cloudStorage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 17.6A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.25"/><path d="M16 16v5l4-4-4-4v3z"/></svg>`,
      monitoring: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M7 13l3-3 2 2 3-3 2 2"/></svg>`,
      cluster: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`
    };
    const ALIAS = {
      "git-branch": "gitbranch",
      "cloud-upload": "cloudupload",
      "cloud-storage": "cloudstorage",
      kubernetes: "k8s"
    };
    const ICONS_LC = Object.fromEntries(Object.entries(ICONS).map(([k, v]) => [k.toLowerCase(), v]));
    const iconSvg = (name) => {
      const raw = (name || "").toString().trim();
      if (raw.startsWith("<svg")) return raw;
      const lc = raw.toLowerCase();
      const key = ALIAS[lc] || lc.replace(/[\s_-]+/g, "");
      return ICONS_LC[key] || ICONS_LC["bolt"];
    };
    function toArray(v) {
      if (Array.isArray(v)) return v;
      if (v && typeof v === "object") return Object.values(v);
      return [];
    }
    const normalizedItems = computed(() => {
      let src = props.items;
      if (typeof src === "string") {
        try {
          src = JSON.parse(src);
        } catch {
          src = [];
        }
      }
      if (src && typeof src === "object" && !Array.isArray(src) && Array.isArray(src.items)) src = src.items;
      return toArray(src).map((it) => {
        if (typeof it === "string") return { title: it, text: "", icon: "bolt" };
        if (it && typeof it === "object") {
          const title = it.title ?? it.name ?? it.heading ?? "";
          const text = it.text ?? it.desc ?? it.description ?? "";
          const icon = it.icon ?? it.ikon ?? it.type ?? "bolt";
          if (!title && !text) return null;
          return { title: String(title), text: String(text), icon: String(icon) };
        }
        return null;
      }).filter(Boolean);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "py-5 services-features",
        id: "learn",
        "aria-label": __props.heading || "Benefity"
      }, _attrs))} data-v-5bedfec5><div class="container d-flex flex-column gap-2" data-v-5bedfec5><h2 class="fs-1 fw-bold mb-4 text-center" data-v-5bedfec5>${ssrInterpolate(__props.heading)}</h2>`);
      if (normalizedItems.value.length) {
        _push(`<div class="p-3 bg-secondary rounded-3" data-v-5bedfec5><div class="row m-0 row-cols-1 row-cols-sm-2 row-cols-lg-3 g-2" data-v-5bedfec5><!--[-->`);
        ssrRenderList(normalizedItems.value, (it, idx) => {
          _push(`<div class="col d-flex" data-v-5bedfec5><div class="border p-2 w-100 d-flex" data-v-5bedfec5><div class="feature-row d-flex flex-column flex-md-row align-items-start gap-3 p-2 w-100" data-v-5bedfec5><div class="ico-wrap" aria-hidden="true" data-v-5bedfec5>${iconSvg(it.icon) ?? ""}</div><div class="d-flex flex-column" data-v-5bedfec5><h5 class="fw-bold mb-1" data-v-5bedfec5>${ssrInterpolate(it.title)}</h5><p class="small mb-0 feature-text clamp-3" data-v-5bedfec5>${ssrInterpolate(it.text)}</p></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Services/Features.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const ServicesFeatures = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-5bedfec5"]]);
const __vite_glob_0_33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServicesFeatures
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = {
  __name: "Hero",
  __ssrInlineRender: true,
  props: {
    /** sjednocený objekt z parentu: { title, lead, image, ctaLabel, ctaHref } */
    hero: { type: Object, default: () => ({}) },
    /** legacy props – fallbacky pro starší výstupy */
    title: { type: String, default: null },
    lead: { type: String, default: null },
    image: { type: [String, Object], default: null },
    ctaLabel: { type: String, default: null },
    ctaHref: { type: String, default: null }
  },
  setup(__props) {
    const props = __props;
    const heroTitle = computed(
      () => {
        var _a;
        return ((_a = props.hero) == null ? void 0 : _a.title) ?? props.title ?? "VPS server";
      }
    );
    const heroLead = computed(
      () => {
        var _a;
        return ((_a = props.hero) == null ? void 0 : _a.lead) ?? props.lead ?? "Vyladěný a bezpečný hosting pro vaše aplikace a projekty";
      }
    );
    const heroImageUrl = computed(() => {
      var _a;
      const v = ((_a = props.hero) == null ? void 0 : _a.image) ?? props.image;
      if (!v) return null;
      if (typeof v === "string") return v;
      if (v && typeof v === "object" && typeof v.src === "string") return v.src;
      return null;
    });
    const ctaLabel = computed(
      () => {
        var _a;
        return ((_a = props.hero) == null ? void 0 : _a.ctaLabel) ?? props.ctaLabel ?? "Zjistit více";
      }
    );
    const ctaHref = computed(
      () => {
        var _a;
        return ((_a = props.hero) == null ? void 0 : _a.ctaHref) ?? props.ctaHref ?? "#learn";
      }
    );
    function cssEscapeUrl(u = "") {
      return String(u).replace(/["\\)]/g, "\\$&");
    }
    const heroStyle = computed(
      () => heroImageUrl.value ? { "--HeroImg": `url("${cssEscapeUrl(heroImageUrl.value)}")` } : {}
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "services-hero services-hero--services-server",
        style: heroStyle.value,
        id: "intro",
        "aria-label": "Hero"
      }, _attrs))} data-v-5d7e57c7><div class="overlay" data-v-5d7e57c7><div class="container text-white" data-v-5d7e57c7><div class="hero-stack text-center" data-v-5d7e57c7><h1 class="services-hero__title fw-800" data-v-5d7e57c7>${ssrInterpolate(heroTitle.value)}</h1><p class="services-hero__lead" data-v-5d7e57c7>${ssrInterpolate(heroLead.value)}</p><a${ssrRenderAttr("href", ctaHref.value)} class="btn btn-primary rounded-3 p-3 px-5" data-v-5d7e57c7>${ssrInterpolate(ctaLabel.value)}</a></div></div></div>`);
      if (heroImageUrl.value) {
        _push(`<noscript data-v-5d7e57c7><img${ssrRenderAttr("src", heroImageUrl.value)} alt="" style="${ssrRenderStyle({ "display": "none" })}" data-v-5d7e57c7></noscript>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Services/Hero.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const ServicesHero = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-5d7e57c7"]]);
const __vite_glob_0_34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServicesHero
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = {
  __name: "TextSplit",
  __ssrInlineRender: true,
  props: {
    blocks: { type: Array, default: () => [] },
    block: { type: Object, default: null }
  },
  setup(__props) {
    const props = __props;
    function normImg(img, title = "") {
      if (!img) return null;
      if (typeof img === "string") return { src: img, alt: title || "Ilustrace" };
      if (img.src) return { src: img.src, alt: img.alt || title || "Ilustrace", srcset: img.srcset || null };
      return null;
    }
    function makeSrcset(srcsetObj) {
      if (!srcsetObj || typeof srcsetObj !== "object") return null;
      try {
        return Object.entries(srcsetObj).filter(([w, url]) => !!url).map(([w, url]) => `${url} ${parseInt(w, 10)}w`).join(", ");
      } catch {
        return null;
      }
    }
    function normParagraphs(b) {
      const raw = Array.isArray(b == null ? void 0 : b.content) ? b.content : Array.isArray(b == null ? void 0 : b.paragraphs) ? b.paragraphs : [];
      if (raw.length) {
        return raw.map((p) => typeof p === "string" ? { text: p } : p).filter((p) => ((p == null ? void 0 : p.text) ?? (p == null ? void 0 : p.html) ?? "").toString().trim() !== "");
      }
      return [b == null ? void 0 : b.text, b == null ? void 0 : b.desc1, b == null ? void 0 : b.desc2, b == null ? void 0 : b.desc3].filter(Boolean).map((t) => ({ text: t }));
    }
    function expandToParagraphs(items) {
      const out = [];
      for (const it of items) {
        if (typeof (it == null ? void 0 : it.text) === "string") {
          const t = it.text.trim();
          if (t) out.push({ text: t });
          continue;
        }
        if (typeof (it == null ? void 0 : it.html) === "string") {
          const src = it.html;
          const re = /<(h3|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
          let m;
          let found = false;
          while ((m = re.exec(src)) !== null) {
            const tag = (m[1] || "").toLowerCase();
            const inner = (m[2] || "").trim();
            if (!inner) continue;
            if (tag === "h3") out.push({ h3Inner: inner });
            else if (tag === "p") out.push({ htmlInner: inner });
            else if (tag === "ul" || tag === "ol") out.push({ htmlBlock: m[0] });
            found = true;
          }
          if (!found) {
            const trimmed = src.trim();
            if (trimmed) out.push({ htmlInner: trimmed });
          }
        }
      }
      return out;
    }
    function isLongText(paragraphs) {
      if (!Array.isArray(paragraphs) || !paragraphs.length) return false;
      const count = paragraphs.length;
      let chars = 0;
      for (const p of paragraphs) {
        if (p.text) chars += String(p.text).length;
        else if (p.htmlInner) chars += String(p.htmlInner).replace(/<[^>]+>/g, "").length;
      }
      return count >= 4 || chars >= 600;
    }
    const rows = computed(() => {
      const src = Array.isArray(props.blocks) && props.blocks.length ? props.blocks : props.block ? [props.block] : [];
      const out = [];
      let splitIndex = 0;
      for (const b of src) {
        const type = ((b == null ? void 0 : b.type) || "split").toLowerCase();
        const title = (b == null ? void 0 : b.title) || "";
        const image = normImg(b == null ? void 0 : b.image, title);
        if (type === "columns") {
          const rawCols = Array.isArray(b == null ? void 0 : b.columns) ? b.columns : [];
          const columns = rawCols.map((col) => {
            const list = Array.isArray(col) ? col : (col == null ? void 0 : col.content) ?? (col == null ? void 0 : col.paragraphs) ?? [];
            return expandToParagraphs(Array.isArray(list) ? list : typeof list === "string" ? [{ html: list }] : []);
          });
          out.push({ kind: "columns", title, columns: [columns[0] ?? [], columns[1] ?? []] });
          continue;
        }
        const paras = expandToParagraphs(normParagraphs(b));
        if (type === "image" || image && paras.length === 0) {
          out.push({ kind: "image-only", title, image });
          continue;
        }
        if ((!image || !image.src) && paras.length) {
          out.push({ kind: "text-only", title, paragraphs: paras });
          continue;
        }
        const imgLeft = typeof (b == null ? void 0 : b.imgLeft) === "boolean" ? b.imgLeft : typeof (b == null ? void 0 : b.imagePosition) === "string" ? b.imagePosition.toLowerCase() === "left" : splitIndex % 2 === 1;
        const matchText = isLongText(paras);
        out.push({ kind: "split", title, paragraphs: paras, image, imgLeft, matchText });
        splitIndex++;
      }
      return out;
    });
    function isMuted(i) {
      const last = rows.value.length - 1;
      if (i === last) return false;
      return i % 2 === 1;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(rows.value, (row, i) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        _push(`<!--[-->`);
        if (row.kind === "split") {
          _push(`<section class="${ssrRenderClass([{ "muted-section": isMuted(i), "match-text": row.matchText }, "services-text services-text--split-clean"])}"${ssrRenderAttr("aria-label", row.title || "Sekce")} data-v-6cf59cc2><div class="container" data-v-6cf59cc2><div class="${ssrRenderClass([{ "grid--mirror": row.imgLeft }, "grid grid--tight grid--vcenter"])}" data-v-6cf59cc2>`);
          if (row.imgLeft) {
            _push(`<figure class="media media--auto" data-v-6cf59cc2><img${ssrRenderAttr("src", (_a = row.image) == null ? void 0 : _a.src)}${ssrRenderAttr("srcset", ((_b = row.image) == null ? void 0 : _b.srcset) ? makeSrcset(row.image.srcset) : null)} sizes="(max-width: 992px) 100vw, 520px"${ssrRenderAttr("alt", ((_c = row.image) == null ? void 0 : _c.alt) || row.title || "Ilustrace")} loading="lazy" data-v-6cf59cc2></figure>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<article class="col-text col-text--vcenter" data-v-6cf59cc2>`);
          if (row.title) {
            _push(`<h2 class="services-text__title" data-v-6cf59cc2>${ssrInterpolate(row.title)}</h2>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          ssrRenderList(row.paragraphs, (p, pi) => {
            _push(`<!--[-->`);
            if (p.h3Inner) {
              _push(`<h3 class="services-text__sub" data-v-6cf59cc2>${p.h3Inner ?? ""}</h3>`);
            } else if (p.text) {
              _push(`<p class="services-text__desc" data-v-6cf59cc2>${ssrInterpolate(p.text)}</p>`);
            } else if (p.htmlInner) {
              _push(`<p class="services-text__desc" data-v-6cf59cc2>${p.htmlInner ?? ""}</p>`);
            } else if (p.htmlBlock) {
              _push(`<div data-v-6cf59cc2>${p.htmlBlock ?? ""}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--></article>`);
          if (!row.imgLeft) {
            _push(`<figure class="media media--auto" data-v-6cf59cc2><img${ssrRenderAttr("src", (_d = row.image) == null ? void 0 : _d.src)}${ssrRenderAttr("srcset", ((_e = row.image) == null ? void 0 : _e.srcset) ? makeSrcset(row.image.srcset) : null)} sizes="(max-width: 992px) 100vw, 520px"${ssrRenderAttr("alt", ((_f = row.image) == null ? void 0 : _f.alt) || row.title || "Ilustrace")} loading="lazy" data-v-6cf59cc2></figure>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></section>`);
        } else if (row.kind === "text-only") {
          _push(`<section class="${ssrRenderClass([{ "muted-section": isMuted(i) }, "services-text services-text--split-clean services-text--centered"])}"${ssrRenderAttr("aria-label", row.title || "Textová sekce")} data-v-6cf59cc2><div class="container" data-v-6cf59cc2><div class="grid" data-v-6cf59cc2><article class="col-text col-text--center" data-v-6cf59cc2>`);
          if (row.title) {
            _push(`<h2 class="services-text__title" data-v-6cf59cc2>${ssrInterpolate(row.title)}</h2>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          ssrRenderList(row.paragraphs, (p, pi) => {
            _push(`<!--[-->`);
            if (p.h3Inner) {
              _push(`<h3 class="services-text__sub" data-v-6cf59cc2>${p.h3Inner ?? ""}</h3>`);
            } else if (p.text) {
              _push(`<p class="services-text__desc" data-v-6cf59cc2>${ssrInterpolate(p.text)}</p>`);
            } else if (p.htmlInner) {
              _push(`<p class="services-text__desc" data-v-6cf59cc2>${p.htmlInner ?? ""}</p>`);
            } else if (p.htmlBlock) {
              _push(`<div data-v-6cf59cc2>${p.htmlBlock ?? ""}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--></article></div></div></section>`);
        } else if (row.kind === "columns") {
          _push(`<section class="${ssrRenderClass([{ "muted-section": isMuted(i) }, "services-text services-text--split-clean"])}"${ssrRenderAttr("aria-label", row.title || "Sekce ve dvou sloupcích")} data-v-6cf59cc2><div class="container" data-v-6cf59cc2>`);
          if (row.title) {
            _push(`<h2 class="services-text__title columns-header" data-v-6cf59cc2>${ssrInterpolate(row.title)}</h2>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="grid grid--2col" data-v-6cf59cc2><article class="col-text" data-v-6cf59cc2><!--[-->`);
          ssrRenderList(((_g = row.columns) == null ? void 0 : _g[0]) || [], (p, pi) => {
            _push(`<!--[-->`);
            if (p.h3Inner) {
              _push(`<h3 class="services-text__sub" data-v-6cf59cc2>${p.h3Inner ?? ""}</h3>`);
            } else if (p.text) {
              _push(`<p class="services-text__desc" data-v-6cf59cc2>${ssrInterpolate(p.text)}</p>`);
            } else if (p.htmlInner) {
              _push(`<p class="services-text__desc" data-v-6cf59cc2>${p.htmlInner ?? ""}</p>`);
            } else if (p.htmlBlock) {
              _push(`<div data-v-6cf59cc2>${p.htmlBlock ?? ""}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--></article><article class="col-text" data-v-6cf59cc2><!--[-->`);
          ssrRenderList(((_h = row.columns) == null ? void 0 : _h[1]) || [], (p, pi) => {
            _push(`<!--[-->`);
            if (p.h3Inner) {
              _push(`<h3 class="services-text__sub" data-v-6cf59cc2>${p.h3Inner ?? ""}</h3>`);
            } else if (p.text) {
              _push(`<p class="services-text__desc" data-v-6cf59cc2>${ssrInterpolate(p.text)}</p>`);
            } else if (p.htmlInner) {
              _push(`<p class="services-text__desc" data-v-6cf59cc2>${p.htmlInner ?? ""}</p>`);
            } else if (p.htmlBlock) {
              _push(`<div data-v-6cf59cc2>${p.htmlBlock ?? ""}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          });
          _push(`<!--]--></article></div></div></section>`);
        } else if (row.kind === "image-only") {
          _push(`<section class="${ssrRenderClass([{ "muted-section": isMuted(i) }, "services-text services-text--split-clean"])}"${ssrRenderAttr("aria-label", row.title || "Obrázková sekce")} data-v-6cf59cc2><div class="container" data-v-6cf59cc2><div class="grid image-only" data-v-6cf59cc2>`);
          if (row.title) {
            _push(`<article class="col-text image-only__title" data-v-6cf59cc2><h2 class="services-text__title" data-v-6cf59cc2>${ssrInterpolate(row.title)}</h2></article>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<figure class="media media--auto image-only__media" data-v-6cf59cc2><img${ssrRenderAttr("src", (_i = row.image) == null ? void 0 : _i.src)}${ssrRenderAttr("srcset", ((_j = row.image) == null ? void 0 : _j.srcset) ? makeSrcset(row.image.srcset) : null)} sizes="(max-width: 992px) 100vw, 920px"${ssrRenderAttr("alt", ((_k = row.image) == null ? void 0 : _k.alt) || row.title || "Ilustrace")} loading="lazy" data-v-6cf59cc2></figure></div></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Services/TextSplit.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const ServicesTextSplit = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-6cf59cc2"]]);
const __vite_glob_0_35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ServicesTextSplit
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = {
  __name: "WhyChoose",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "why-choose",
        "aria-label": "Proč si firmy vybírají nás"
      }, _attrs))}><div class="container d-flex flex-column gap-2"><div class="bg-white p-4 rounded-3"><h2 class="fw-bold text-center">Proč si firmy vybírají nás</h2><div class="row m-0 row-cols-1 row-cols-sm-2 row-cols-lg-3 text-center"><div class="col border border-secondary p-3 d-flex flex-column"><div class="why-choose__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 32" fill="none" role="img" focusable="false"><g clip-path="url(#clip0_2004_2897)"><path d="M16.6664 4C19.7809 6.75543 23.8457 8.19009 27.9998 8C28.6046 10.0574 28.7896 12.2153 28.5439 14.3456C28.2983 16.4759 27.6269 18.535 26.5697 20.4007C25.5124 22.2664 24.091 23.9005 22.3897 25.206C20.6885 26.5114 18.7422 27.4616 16.6664 28C14.5907 27.4616 12.6444 26.5114 10.9432 25.206C9.24193 23.9005 7.82046 22.2664 6.76324 20.4007C5.70602 18.535 5.03462 16.4759 4.78895 14.3456C4.54327 12.2153 4.72832 10.0574 5.33311 8C9.48715 8.19009 13.552 6.75543 16.6664 4Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.333 14.6667C15.333 15.0203 15.4735 15.3595 15.7235 15.6095C15.9736 15.8596 16.3127 16 16.6663 16C17.02 16 17.3591 15.8596 17.6092 15.6095C17.8592 15.3595 17.9997 15.0203 17.9997 14.6667C17.9997 14.3131 17.8592 13.9739 17.6092 13.7239C17.3591 13.4739 17.02 13.3334 16.6663 13.3334C16.3127 13.3334 15.9736 13.4739 15.7235 13.7239C15.4735 13.9739 15.333 14.3131 15.333 14.6667Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.6665 16V19.3333" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_2004_2897"><rect width="32" height="32" fill="white" transform="translate(0.666504)"></rect></clipPath></defs></svg></div><h5 class="fw-bold">Maximální bezpečnost</h5><p class="small"> Aktivní ochrana proti DDoS, pokročilý firewall a systém IDS/IPS chrání váš server v reálném čase – bez skrytých poplatků a bez kompromisů. Vaše data jsou v bezpečí. </p></div><div class="col border border-secondary p-3 d-flex flex-column"><div class="why-choose__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none"><path d="M9.46484 12.1344C8.97331 12.6259 8.18725 12.6193 7.70176 12.1339C7.21627 11.6484 7.20554 10.8582 7.69707 10.3667C8.1886 9.87517 8.98403 9.88059 9.46951 10.3661C9.95501 10.8516 9.95634 11.6429 9.46484 12.1344Z" stroke="#F52130" stroke-width="1.5"></path><path d="M9.83301 9.99996L11.4997 8.33329M11.4997 8.33329L13.1663 6.66663L14.833 8.33329M11.4997 8.33329L12.7497 9.58329" stroke="#F52130" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.1665 9.31938V6.9002C18.1665 5.53353 18.1665 4.85019 17.8298 4.40437C17.493 3.95853 16.7316 3.74209 15.2088 3.30921C14.1683 3.01346 13.2512 2.65715 12.5184 2.33187C11.5193 1.88838 11.0198 1.66663 10.6665 1.66663C10.3132 1.66663 9.81367 1.88838 8.8146 2.33187C8.08183 2.65715 7.1647 3.01345 6.12428 3.30921C4.60145 3.74209 3.84002 3.95853 3.50326 4.40437C3.1665 4.85019 3.1665 5.53353 3.1665 6.9002V9.31938C3.1665 14.007 7.38548 16.8195 9.49484 17.9328C10.0008 18.1998 10.2537 18.3333 10.6665 18.3333C11.0793 18.3333 11.3323 18.1998 11.8382 17.9328C13.9475 16.8195 18.1665 14.007 18.1665 9.31938Z" stroke="#F52130" stroke-width="1.5" stroke-linecap="round"></path></svg></div><h5 class="fw-bold">Maximální bezpečnost</h5><p class="small">Aktivní ochrana proti DDoS, pokročilý firewall a systém IDS/IPS chrání váš server v reálném čase – bez skrytých poplatků a bez kompromisů. Vaše data jsou v bezpečí.</p></div><div class="col border border-secondary p-3 d-flex flex-column"><div class="why-choose__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none"><g clip-path="url(#clip0_2004_2903)"><path d="M24.333 5.33337C25.3939 5.33337 26.4113 5.7548 27.1614 6.50495C27.9116 7.25509 28.333 8.27251 28.333 9.33337V20C28.333 21.0609 27.9116 22.0783 27.1614 22.8285C26.4113 23.5786 25.3939 24 24.333 24H17.6663L10.9997 28V24H8.33301C7.27214 24 6.25473 23.5786 5.50458 22.8285C4.75444 22.0783 4.33301 21.0609 4.33301 20V9.33337C4.33301 8.27251 4.75444 7.25509 5.50458 6.50495C6.25473 5.7548 7.27214 5.33337 8.33301 5.33337H24.333Z" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.9995 12H13.0128" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.6665 12H19.6798" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12.9995 17.3334C13.434 17.7768 13.9526 18.1291 14.525 18.3697C15.0974 18.6102 15.712 18.7341 16.3328 18.7341C16.9537 18.7341 17.5683 18.6102 18.1407 18.3697C18.713 18.1291 19.2317 17.7768 19.6662 17.3334" stroke="#F52130" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_2004_2903"><rect width="32" height="32" fill="white" transform="translate(0.333008)"></rect></clipPath></defs></svg></div><h5 class="fw-bold">Maximální bezpečnost</h5><p class="small">Aktivní ochrana proti DDoS, pokročilý firewall a systém IDS/IPS chrání váš server v reálném čase – bez skrytých poplatků a bez kompromisů. Vaše data jsou v bezpečí.</p></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Components/Services/WhyChoose.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __vite_glob_0_36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = {
  __name: "Contact",
  __ssrInlineRender: true,
  props: {
    page: { type: Object, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_Head = resolveComponent("Head");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Head, {
        title: `${((_c = (_b = (_a = __props.page) == null ? void 0 : _a.data) == null ? void 0 : _b.hero) == null ? void 0 : _c.title) ?? "Kontakt"} | IT Globe s.r.o.`
      }, null, _parent));
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main>`);
      _push(ssrRenderComponent(_sfc_main$l, { page: __props.page }, null, _parent));
      _push(ssrRenderComponent(ContactContent, { page: __props.page }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$k, { page: __props.page }, null, _parent));
      _push(ssrRenderComponent(Cta, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$F, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Contact.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __vite_glob_0_37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    services: { type: Array, default: () => [] },
    service: { type: Object, default: null },
    about: { type: Object, default: null },
    contact: { type: Object, default: null }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const titles = {
      dashboard: "Dashboard",
      add: "Přidat stránku (service)",
      edit: "Stránky",
      about: "O nás",
      contact: "Kontakt",
      profile: "Upravit profil"
    };
    const view = computed(() => {
      const url = page.url || "";
      const qs = url.includes("?") ? url.split("?")[1] : "";
      return new URLSearchParams(qs).get("view") || "edit";
    });
    const editId = computed(() => {
      const url = page.url || "";
      const qs = url.includes("?") ? url.split("?")[1] : "";
      const id = new URLSearchParams(qs).get("id");
      return id ? Number(id) : null;
    });
    function setView(v) {
      router.visit(`?view=${v}`, { replace: true, preserveScroll: true });
    }
    const flashSuccess = computed(() => {
      var _a, _b;
      return ((_b = (_a = page.props) == null ? void 0 : _a.flash) == null ? void 0 : _b.success) || "";
    });
    const flashError = computed(() => {
      var _a, _b;
      return ((_b = (_a = page.props) == null ? void 0 : _a.flash) == null ? void 0 : _b.error) || "";
    });
    onMounted(() => {
      const ok = document.querySelector('[data-flash="success"]');
      const er = document.querySelector('[data-flash="error"]');
      if (ok) setTimeout(() => ok.remove(), 3500);
      if (er) setTimeout(() => er.remove(), 5e3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: titles[view.value] || "Admin"
      }, null, _parent));
      _push(`<div class="admin-shell" data-v-0d824003><div class="admin-main" data-v-0d824003>`);
      _push(ssrRenderComponent(AdminSidebar, {
        active: view.value,
        onSelect: setView
      }, null, _parent));
      _push(`<main class="admin-content" data-v-0d824003><div class="container-fluid py-4" data-v-0d824003><div class="d-flex align-items-center justify-content-between gap-2 mb-2" data-v-0d824003><h1 class="page-title" data-v-0d824003>${ssrInterpolate(titles[view.value] || "Admin")}</h1>`);
      if (view.value === "edit" && props.service) {
        _push(`<div class="d-flex gap-2" data-v-0d824003><button class="btn btn-light border btn-sm" data-v-0d824003> ← Zpět na seznam </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (flashSuccess.value) {
        _push(`<div class="alert alert-success" role="alert" data-flash="success" data-v-0d824003>${ssrInterpolate(flashSuccess.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (flashError.value) {
        _push(`<div class="alert alert-danger" role="alert" data-flash="error" data-v-0d824003>${ssrInterpolate(flashError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (view.value === "dashboard") {
        _push(`<section data-v-0d824003><div class="card-wrap" data-v-0d824003><p class="muted m-0" data-v-0d824003>Sem si můžeš později dát statistiky, rychlé akce apod.</p></div></section>`);
      } else if (view.value === "add") {
        _push(`<section data-v-0d824003>`);
        _push(ssrRenderComponent(ServiceForm, { mode: "create" }, null, _parent));
        _push(`</section>`);
      } else if (view.value === "edit") {
        _push(`<section data-v-0d824003>`);
        if (props.service) {
          _push(`<div class="card-wrap mb-2" data-v-0d824003><small class="text-muted" data-v-0d824003>Upravuješ ID: ${ssrInterpolate(editId.value ?? ((_a = props.service) == null ? void 0 : _a.id))}</small><h2 class="h5 fw-extrabold mt-1 mb-3" data-v-0d824003>Upravit: ${ssrInterpolate(props.service.title)}</h2>`);
          _push(ssrRenderComponent(ServiceForm, {
            mode: "edit",
            initial: props.service
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(ssrRenderComponent(ServicesTable, {
            items: props.services
          }, null, _parent));
        }
        _push(`</section>`);
      } else if (view.value === "about") {
        _push(`<section data-v-0d824003><div class="card-wrap mb-2" data-v-0d824003><h2 class="h5 fw-extrabold mt-1 mb-3" data-v-0d824003>Upravit: O nás</h2>`);
        _push(ssrRenderComponent(PageForm, {
          key: "about",
          slug: "o-nas",
          initial: props.about || { id: null, slug: "o-nas", title: "O nás", published: true, data: {} }
        }, null, _parent));
        _push(`</div></section>`);
      } else if (view.value === "contact") {
        _push(`<section data-v-0d824003><div class="card-wrap mb-2" data-v-0d824003><h2 class="h5 fw-extrabold mt-1 mb-3" data-v-0d824003>Upravit: Kontakt</h2>`);
        _push(ssrRenderComponent(PageForm, {
          key: "contact",
          slug: "kontakt",
          initial: props.contact || { id: null, slug: "kontakt", title: "Kontakt", published: true, data: {} }
        }, null, _parent));
        _push(`</div></section>`);
      } else if (view.value === "profile") {
        _push(`<section data-v-0d824003><div class="card-wrap" data-v-0d824003><p class="muted m-0" data-v-0d824003>Profil (dummy) – sem přijde formulář.</p></div></section>`);
      } else {
        _push(`<section data-v-0d824003><div class="card-wrap" data-v-0d824003><p class="muted m-0" data-v-0d824003>Neznámá záložka.</p></div></section>`);
      }
      _push(`</div></main></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Dashboard = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-0d824003"]]);
const __vite_glob_0_38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$3 = {
  __name: "Home",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "IT Globe" }, null, _parent));
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$i, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$j, null, null, _parent));
      _push(ssrRenderComponent(ServicesSection, null, null, _parent));
      _push(ssrRenderComponent(WhySection, null, null, _parent));
      _push(ssrRenderComponent(DrivesSection, null, null, _parent));
      _push(ssrRenderComponent(Cta, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$F, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __vite_glob_0_39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$3
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$2 = {
  __name: "Login",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      email: "",
      password: ""
      // remember: false, // pokud bys chtěl "pamatuj si mě"
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Přihlášení" }, null, _parent));
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main class="login-page" data-v-a80af460><div class="container d-flex justify-content-center align-items-start login-container" data-v-a80af460><div class="card shadow-sm border-0 login-card" data-v-a80af460><div class="card-body p-4 p-md-5" data-v-a80af460><h1 class="h3 fw-bold mb-3 font-sora" data-v-a80af460>Přihlášení</h1><p class="text-muted mb-4" data-v-a80af460>Zadejte své přihlašovací údaje.</p>`);
      if ((_a = _ctx.$page.props.flash) == null ? void 0 : _a.error) {
        _push(`<div class="alert alert-danger" role="alert" data-v-a80af460>${ssrInterpolate(_ctx.$page.props.flash.error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form novalidate data-v-a80af460><div class="mb-3" data-v-a80af460><label for="email" class="form-label fw-semibold" data-v-a80af460>E-mail</label><input id="email" type="email" class="${ssrRenderClass([{ "is-invalid": unref(form).errors.email }, "form-control"])}"${ssrRenderAttr("value", unref(form).email)} autocomplete="username" required data-v-a80af460>`);
      if (unref(form).errors.email) {
        _push(`<div class="invalid-feedback" data-v-a80af460>${ssrInterpolate(unref(form).errors.email)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-4" data-v-a80af460><label for="password" class="form-label fw-semibold" data-v-a80af460>Heslo</label><input id="password" type="password" class="${ssrRenderClass([{ "is-invalid": unref(form).errors.password }, "form-control"])}"${ssrRenderAttr("value", unref(form).password)} autocomplete="current-password" required data-v-a80af460>`);
      if (unref(form).errors.password) {
        _push(`<div class="invalid-feedback" data-v-a80af460>${ssrInterpolate(unref(form).errors.password)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="d-grid" data-v-a80af460><button type="submit" class="btn btn-primary btn-lg"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-a80af460><i class="fa-solid fa-right-to-bracket me-2" aria-hidden="true" data-v-a80af460></i> ${ssrInterpolate(unref(form).processing ? "Přihlašuji…" : "Přihlásit se")}</button></div></form></div></div></div></main>`);
      _push(ssrRenderComponent(_sfc_main$F, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Login.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Login = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-a80af460"]]);
const __vite_glob_0_40 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = {
  __name: "References",
  __ssrInlineRender: true,
  props: {
    references: { type: Array, default: () => [] }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Reference | IT Globe s.r.o." }, null, _parent));
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main>`);
      _push(ssrRenderComponent(ReferencesHero, null, null, _parent));
      _push(ssrRenderComponent(Partners, { items: __props.references }, null, _parent));
      _push(ssrRenderComponent(Cta, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$F, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/References.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __vite_glob_0_41 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = {
  __name: "Services",
  __ssrInlineRender: true,
  props: {
    service: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const heroData = computed(() => {
      var _a, _b, _c, _d, _e;
      const h2 = ((_a = props.service) == null ? void 0 : _a.hero) || {};
      return {
        title: h2.title ?? ((_b = props.service) == null ? void 0 : _b.hero_title) ?? ((_c = props.service) == null ? void 0 : _c.title) ?? "",
        lead: h2.lead ?? ((_d = props.service) == null ? void 0 : _d.hero_lead) ?? "",
        image: h2.image ?? ((_e = props.service) == null ? void 0 : _e.hero_image) ?? null,
        ctaLabel: h2.ctaLabel ?? "Zjistit více",
        ctaHref: h2.ctaHref ?? "#learn"
      };
    });
    const blocks = computed(() => {
      var _a, _b, _c;
      const sec = Array.isArray((_a = props.service) == null ? void 0 : _a.sections) ? props.service.sections : [];
      if (sec.length) return sec;
      const b = (_b = props.service) == null ? void 0 : _b.textSplit;
      if (!b) return [];
      const paragraphs = Array.isArray(b.paragraphs) ? b.paragraphs.filter(Boolean) : [b.desc1, b.desc2].filter(Boolean);
      return [{
        type: "split",
        title: b.title || ((_c = props.service) == null ? void 0 : _c.title) || "",
        paragraphs,
        image: b.image ? { src: b.image, alt: b.title || "Ilustrace" } : null
      }];
    });
    function parseFeatures(input) {
      const f = input;
      if (f && typeof f === "object" && !Array.isArray(f)) {
        return { heading: f.heading ?? null, items: Array.isArray(f.items) ? f.items : [] };
      }
      if (Array.isArray(f)) return { heading: null, items: f };
      if (typeof f === "string") {
        try {
          const parsed = JSON.parse(f);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return { heading: parsed.heading ?? null, items: Array.isArray(parsed.items) ? parsed.items : [] };
          }
          if (Array.isArray(parsed)) return { heading: null, items: parsed };
        } catch {
        }
      }
      return { heading: null, items: [] };
    }
    const featuresRaw = computed(() => {
      var _a;
      return parseFeatures((_a = props.service) == null ? void 0 : _a.features);
    });
    const featuresItems = computed(() => {
      return (featuresRaw.value.items || []).filter((it) => {
        const t = ((it == null ? void 0 : it.title) ?? (it == null ? void 0 : it.text) ?? "").trim();
        const d = ((it == null ? void 0 : it.desc) ?? (it == null ? void 0 : it.html) ?? "").trim();
        return t !== "" || d !== "";
      });
    });
    const featuresHeading = computed(() => {
      const h2 = featuresRaw.value.heading;
      return typeof h2 === "string" && h2.trim() !== "" ? h2.trim() : null;
    });
    const showFeatures = computed(() => {
      return !!featuresHeading.value || featuresItems.value.length > 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `${((_a = __props.service) == null ? void 0 : _a.title) || "Služba"} | IT Globe s.r.o.`
      }, null, _parent));
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main>`);
      _push(ssrRenderComponent(ServicesHero, { hero: heroData.value }, null, _parent));
      _push(ssrRenderComponent(ServicesTextSplit, { blocks: blocks.value }, null, _parent));
      if (showFeatures.value) {
        _push(ssrRenderComponent(ServicesFeatures, {
          heading: featuresHeading.value || "Benefity",
          items: featuresItems.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$6, null, null, _parent));
      _push(ssrRenderComponent(Cta, null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(_sfc_main$F, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Services.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __vite_glob_0_42 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.vue`,
      /* @__PURE__ */ Object.assign({ "./Pages/About.vue": __vite_glob_0_0, "./Pages/Components/About/AboutUs.vue": __vite_glob_0_1, "./Pages/Components/About/Hero.vue": __vite_glob_0_2, "./Pages/Components/About/Infrastructure.vue": __vite_glob_0_3, "./Pages/Components/About/OurTeam.vue": __vite_glob_0_4, "./Pages/Components/Admin/AdminReferences.vue": __vite_glob_0_5, "./Pages/Components/Admin/AdminSidebar.vue": __vite_glob_0_6, "./Pages/Components/Admin/DropzoneImage.vue": __vite_glob_0_7, "./Pages/Components/Admin/FeaturesEditor.vue": __vite_glob_0_8, "./Pages/Components/Admin/PageForm.vue": __vite_glob_0_9, "./Pages/Components/Admin/ReferenceForm.vue": __vite_glob_0_10, "./Pages/Components/Admin/ReferencesTable.vue": __vite_glob_0_11, "./Pages/Components/Admin/RichTextEditor.vue": __vite_glob_0_12, "./Pages/Components/Admin/SectionCard.vue": __vite_glob_0_13, "./Pages/Components/Admin/ServiceForm.vue": __vite_glob_0_14, "./Pages/Components/Admin/ServicesTable.vue": __vite_glob_0_15, "./Pages/Components/Contact/Content.vue": __vite_glob_0_16, "./Pages/Components/Contact/Form.vue": __vite_glob_0_17, "./Pages/Components/Contact/Hero.vue": __vite_glob_0_18, "./Pages/Components/Contact/Map.vue": __vite_glob_0_19, "./Pages/Components/Cta.vue": __vite_glob_0_20, "./Pages/Components/Footer.vue": __vite_glob_0_21, "./Pages/Components/Header.vue": __vite_glob_0_22, "./Pages/Components/Home/About.vue": __vite_glob_0_23, "./Pages/Components/Home/Companies.vue": __vite_glob_0_24, "./Pages/Components/Home/Drives.vue": __vite_glob_0_25, "./Pages/Components/Home/Hero.vue": __vite_glob_0_26, "./Pages/Components/Home/Services.vue": __vite_glob_0_27, "./Pages/Components/Home/Why.vue": __vite_glob_0_28, "./Pages/Components/References/ContactAction.vue": __vite_glob_0_29, "./Pages/Components/References/Hero.vue": __vite_glob_0_30, "./Pages/Components/References/Partners.vue": __vite_glob_0_31, "./Pages/Components/References/ReferencesHero.vue": __vite_glob_0_32, "./Pages/Components/Services/Features.vue": __vite_glob_0_33, "./Pages/Components/Services/Hero.vue": __vite_glob_0_34, "./Pages/Components/Services/TextSplit.vue": __vite_glob_0_35, "./Pages/Components/Services/WhyChoose.vue": __vite_glob_0_36, "./Pages/Contact.vue": __vite_glob_0_37, "./Pages/Dashboard.vue": __vite_glob_0_38, "./Pages/Home.vue": __vite_glob_0_39, "./Pages/Login.vue": __vite_glob_0_40, "./Pages/References.vue": __vite_glob_0_41, "./Pages/Services.vue": __vite_glob_0_42 })
    ),
    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) }).use(plugin);
    }
  })
);
