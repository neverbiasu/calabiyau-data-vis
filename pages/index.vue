<template>
  <div class="h-screen bg-bg-core text-text-main font-base flex flex-col overflow-hidden relative">
    
    <!-- Background Decor (Floating Particles) -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]"></div>
    </div>

    <!-- Main Content Centered -->
    <main class="flex-1 flex items-center justify-center relative z-10 w-full max-w-7xl mx-auto px-6">
      
      <!-- Left: Text & Search -->
      <div class="flex-1 flex flex-col items-start gap-8">
        <div>
           <h1 class="text-6xl font-rounded font-bold text-text-main mb-2">
             Strinova <span class="text-primary">DB</span>
           </h1>
           <p class="text-xl text-text-muted font-rounded">
             Discover the Meta in a <span class="text-secondary font-bold">Kawaii</span> Way~
           </p>
        </div>

        <!-- Search Bar -->
        <div class="w-full max-w-lg relative group">
           <input 
             type="text" 
             placeholder="Search Character / Weapon..." 
             class="w-full h-16 pl-6 pr-14 rounded-full border-2 border-border-color bg-white shadow-sm focus:border-primary focus:shadow-[0_0_0_4px_rgba(255,159,205,0.2)] outline-none transition-all text-lg"
           />
           <button class="absolute right-3 top-3 h-10 w-10 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-full flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
           </button>
        </div>

        <!-- Quick Nav -->
        <div class="flex flex-wrap gap-4">
           <button class="px-6 py-3 bg-white border border-border-color rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex items-center gap-2 group">
              <span class="w-3 h-3 rounded-full bg-secondary group-hover:scale-125 transition-transform"></span>
              <span>All Characters</span>
           </button>
           <button class="px-6 py-3 bg-white border border-border-color rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex items-center gap-2 group">
              <span class="w-3 h-3 rounded-full bg-accent group-hover:scale-125 transition-transform"></span>
              <span>Weapon Meta</span>
           </button>
        </div>
      </div>

      <!-- Right: Hero Image (Placeholder for now) -->
      <div class="flex-1 flex justify-center items-center relative">
         <!-- This would be the Tachie/Illustration -->
         <div class="w-[500px] h-[600px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[4rem] flex items-center justify-center border-4 border-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default backdrop-blur-sm">
            <span class="text-text-muted font-rounded text-2xl opacity-50">Tachie / Vibe Image</span>
            <!-- Eventually we'll put an <img> here -->
         </div>
      </div>

    </main>

    <!-- Footer -->
    <footer class="h-16 flex items-center justify-center text-sm text-text-muted/60 relative z-10">
      Strinova Analytics MVP © 2025 // Data from Wiki
    </footer>

  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '~/stores/data';
import { onMounted } from 'vue';

const store = useDataStore();

onMounted(() => {
    store.fetchData();
});
</script>
