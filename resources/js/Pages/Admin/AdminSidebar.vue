<!-- resources/js/Pages/Admin/AdminSidebar.vue -->
<script setup>


const props = defineProps({
  // 'addService' | 'service' | 'references' | 'about' | 'contact' | 'profile'
  active: { type: String, default: 'service' },
})

const emit = defineEmits(['select'])
</script>

<template>
  <aside class="admin-sidebar" aria-label="Sidebar">
    <div class="brand">
      <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
      <span class="brand-name">Admin</span>
    </div>

    <nav class="menu" aria-label="Main menu">
      <div class="menu-label">Stránky</div>
      <div class="menu-section">
        <a
          href="#"
          class="menu-item"
          :class="{ active: active==='addService' }"
          @click.prevent="emit('select','addService')"
        >
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          <span>Přidat stránku</span>
        </a>

        <a
          href="#"
          class="menu-item"
          :class="{ active: active==='service' }"
          @click.prevent="emit('select','service')"
        >
          <i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>
          <span>Upravit stránky</span>
        </a>
      </div>

      <div class="menu-label">Reference</div>
      <div class="menu-section">
        <a
          href="#"
          class="menu-item"
          :class="{ active: active==='references' }"
          @click.prevent="emit('select','references')"
        >
          <i class="fa-regular fa-handshake" aria-hidden="true"></i>
          <span>Reference</span>
        </a>
      </div>

      <div class="menu-label">Statické</div>
      <div class="menu-section">
        <a
          href="#"
          class="menu-item"
          :class="{ active: active==='about' }"
          @click.prevent="emit('select','about')"
        >
          <i class="fa-regular fa-id-card" aria-hidden="true"></i>
          <span>O nás</span>
        </a>

        <a
          href="#"
          class="menu-item"
          :class="{ active: active==='contact' }"
          @click.prevent="emit('select','contact')"
        >
          <i class="fa-regular fa-envelope" aria-hidden="true"></i>
          <span>Kontakt</span>
        </a>
      </div>

      <div class="menu-label">Účet</div>
      <div class="menu-section">
        <a
          href="#"
          class="menu-item"
          :class="{ active: active==='profile' }"
          @click.prevent="emit('select','profile')"
        >
          <i class="fa-solid fa-user-gear" aria-hidden="true"></i>
          <span>Upravit profil</span>
        </a>
      </div>
    </nav>

    <button type="button" class="menu-item logout">
      <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
      <span>Odhlásit</span>
    </button>
  </aside>
</template>

<style scoped lang="scss">
.admin-sidebar{
  position: sticky;
  top: 0;
  background:#0f1217;
  color:#fff;
  display:flex;
  flex-direction:column;
  border-right:1px solid rgba(255,255,255,.06);
  height:100vh; 
  height:100dvh;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
  height:58px;
  padding:0 16px;
  border-bottom:1px solid rgba(255,255,255,.06);
  i{ font-size:18px; color:var(--Accent); }
  .brand-name{ font:800 16px/1 "Sora",system-ui,sans-serif; }
}

.menu{
  display:flex;
  flex-direction:column;
  gap:6px;
  padding:12px;
  padding-bottom:0;
  flex:1 1 auto;
  overflow-y:auto;
}

.menu-label{
  margin:10px 6px 4px;
  color:rgba(255,255,255,.6);
  font:800 11px/1 "Plus Jakarta Sans",system-ui,sans-serif;
  text-transform:uppercase;
  letter-spacing:.06em;
}

.menu-section{ display:flex; flex-direction:column; gap:6px; }

.menu-item{
  display:flex;
  align-items:center;
  gap:10px;
  width:100%;
  padding:10px 12px;
  border-radius:10px;
  background:transparent;
  border:0;
  color:#e9edf2;
  text-decoration:none;
  cursor:pointer;
  font:600 14px/1 "Plus Jakarta Sans",system-ui,sans-serif;
  transition:.15s;
  i{ width:18px; text-align:center; }
  &:hover{ background:rgba(255,255,255,.06); color:#fff; }
}

.menu-item.active{
  background: color-mix(in srgb, var(--Accent) 16%, #0f1217);
  color:#fff;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--Accent) 28%, transparent);
}

.menu-item.logout{
  margin:0;
  border-radius:0;
  border-top:1px solid rgba(255,255,255,.06);
  background:rgba(255,255,255,.04);
  color:#ffdede;
  padding:12px 16px;
  &:hover{
    background:color-mix(in srgb, var(--Accent) 20%, #0f1217);
    color:#fff;
  }
}

@media (max-width: 992px){
  .brand .brand-name{ display:none; }
  .menu-item span{ display:none; }
  .menu-item{ justify-content:center; }
  .menu-label{ display:none; }
}
</style>
