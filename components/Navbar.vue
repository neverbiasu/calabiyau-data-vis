<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <header class="w-full z-50 px-6 py-4 lg:px-12 fixed top-0 left-0 transition-all duration-300">
    <div class="glass-panel mx-auto max-w-7xl rounded-full px-6 py-3 flex items-center justify-between bg-white/60 dark:bg-black/20 shadow-sm relative">
      
      <!-- Left: Logo -->
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="size-10 rounded-full flex items-center justify-center bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
             <NuxtImg src="/images/logo.png" alt="Calabiyau Logo" class="w-full h-full object-cover" />
          </div>
          <h2 class="text-text-dark dark:text-white text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
            Calabiyau <span class="text-primary">Data Vis</span>
          </h2>
        </NuxtLink>
      </div>

      <!-- Center: Navigation Links -->
      <nav class="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        <NuxtLink 
            to="/" 
            class="text-sm font-bold transition-all hover:text-primary"
            :class="route.path === '/' ? 'text-primary' : 'text-text-dark dark:text-white/80'"
        >
            Home
        </NuxtLink>
        <NuxtLink 
            to="/characters" 
            class="text-sm font-bold transition-all hover:text-primary"
            :class="route.path.startsWith('/characters') ? 'text-primary' : 'text-text-dark dark:text-white/80'"
        >
            Characters
        </NuxtLink>
        <NuxtLink 
            to="/weapons" 
            class="text-sm font-bold transition-all hover:text-primary"
            :class="route.path.startsWith('/weapons') ? 'text-primary' : 'text-text-dark dark:text-white/80'"
        >
            Weapons
        </NuxtLink>
        <NuxtLink 
            to="/tools/compare" 
            class="text-sm font-bold transition-all hover:text-primary"
            :class="route.path.startsWith('/tools') ? 'text-primary' : 'text-text-dark dark:text-white/80'"
        >
            Compare
        </NuxtLink>
      </nav>

      <!-- Right: Mobile Menu Button (Placeholder) / Socials -->
      <div class="flex items-center gap-4">
          <!-- Placeholder for alignment or social icons -->
          <div class="hidden md:block w-8"></div> 
          <button class="md:hidden text-text-dark dark:text-white">
            <span class="material-symbols-outlined">menu</span>
          </button>
      </div>

    </div>
  </header>
</template>

<style scoped>
.glass-panel {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
}
.dark .glass-panel {
    border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
