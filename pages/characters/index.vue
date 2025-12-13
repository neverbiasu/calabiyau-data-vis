<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const { data, fetchData, isLoading, getFaction } = useStrinovaData();
const searchQuery = ref('');

onMounted(() => {
  fetchData();
});

const groupedCharacters = computed(() => {
    const groups: Record<string, any[]> = {
        'The Scissors': [],
        'Urbino': [],
        'Opal': [],
        'Others': []
    };

    if (!data.value) return groups;
    
    data.value.characters.forEach(char => {
        // Filter by search
        if (searchQuery.value && !char.name.toLowerCase().includes(searchQuery.value.toLowerCase()) && !char.id.includes(searchQuery.value)) {
            return;
        }
        
        // Use shared helper
        const faction = getFaction(char.id) || 'Others';
        
        if (groups[faction]) {
            groups[faction].push(char);
        } else {
            groups['Others'].push(char);
        }
    });
    
    return groups;
});
</script>

<template>
<div class="font-display bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light min-h-screen flex flex-col overflow-x-hidden bg-gradient-animated selection:bg-primary selection:text-white pb-24">
  <header class="w-full z-50 px-6 py-4 lg:px-12 fixed top-0 left-0 transition-all duration-300">
    <div class="glass-panel mx-auto max-w-7xl rounded-full px-6 py-3 flex items-center justify-between bg-white/60 dark:bg-black/20 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="size-8 rounded-full bg-primary flex items-center justify-center text-white shadow-glow">
          <span class="material-symbols-outlined text-xl">data_exploration</span>
        </div>
        <h2 class="text-text-dark dark:text-white text-lg font-bold tracking-tight">Strinova <span class="text-primary">CC</span></h2>
      </div>
      <nav class="hidden md:flex items-center gap-8 mx-auto">
        <NuxtLink class="text-text-dark dark:text-white/80 text-sm font-medium hover:text-primary transition-colors" to="/">Home</NuxtLink>
        <NuxtLink class="text-primary font-bold text-sm transition-colors" to="/characters">Characters</NuxtLink>
        <NuxtLink class="text-text-dark dark:text-white/80 text-sm font-medium hover:text-primary transition-colors" to="/weapons">Weapons</NuxtLink>
        <a class="text-text-dark dark:text-white/80 text-sm font-medium hover:text-primary transition-colors" href="#">Analytics</a>
      </nav>
      <div class="hidden md:block w-8"></div>
      <button class="md:hidden text-text-dark dark:text-white">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </div>
  </header>
  
  <main class="flex-grow flex flex-col items-center w-full z-10 pt-32 pb-12 gap-12 px-0 lg:px-0 max-w-[100%] mx-auto">
    <section class="text-center space-y-4 w-full max-w-4xl px-6 lg:px-12">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-text-dark dark:text-white drop-shadow-sm">
            Select Your <span class="text-primary">Superstringer</span>
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-xl mx-auto">
            Explore detailed stats, loadouts, and artwork for every character in the multiverse.
      </p>
    </section>
    
    <div class="w-full max-w-xl relative group z-20 px-6 lg:px-12">
      <div class="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div class="relative flex items-center w-full h-14 bg-white dark:bg-gray-800 rounded-full shadow-soft border border-white/50 dark:border-white/10 focus-within:border-primary/50 transition-all overflow-hidden px-2">
        <div class="pl-4 text-gray-400">
          <span class="material-symbols-outlined text-2xl">search</span>
        </div>
        <input 
            v-model="searchQuery"
            class="w-full h-full bg-transparent border-none outline-none focus:ring-0 text-text-dark dark:text-white placeholder-gray-400 ml-2 text-base" 
            placeholder="Find by name (e.g. Kokona)..." 
            type="text"
        />
        <button class="h-10 px-6 bg-primary hover:bg-red-600 text-white font-bold rounded-full transition-colors flex items-center justify-center shadow-md m-2 text-sm">
                Search
        </button>
      </div>
    </div>

    <!-- The Scissors -->
    <section v-if="groupedCharacters['The Scissors'].length > 0" class="w-full mt-8 relative">
      <div class="flex items-center justify-between mb-8 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-2xl bg-[#ffeaef] dark:bg-primary/20 text-primary flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined">content_cut</span>
          </div>
          <div class="flex flex-col">
            <h2 class="text-2xl font-bold text-text-dark dark:text-white">The Scissors</h2>
            <span class="text-xs font-bold text-gray-400 tracking-widest uppercase">剪刀手</span>
          </div>
        </div>
      </div>
      <div class="w-full overflow-x-auto scrollbar-hide snap-x-mandatory pb-8 px-6 lg:px-12">
        <div class="flex gap-6 w-max">
          <NuxtLink v-for="char in groupedCharacters['The Scissors']" :key="char.id" class="group glass-panel bg-white/40 dark:bg-white/5 rounded-[2rem] overflow-hidden card-hover-effect relative w-72 md:w-80 snap-center flex-shrink-0" :to="`/characters/${char.id}`">
            <div class="aspect-[3/4] w-full relative overflow-hidden bg-gradient-to-br from-primary-soft to-white dark:from-primary/10 dark:to-gray-900 border-b border-white/20">
              <img :src="char.icon" :alt="char.name" class="absolute inset-0 w-full h-full object-contain p-8 object-center transition-transform duration-700 group-hover:scale-110"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-5 relative z-10">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors capitalize">{{ char.id }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ char.name }}</p>
                </div>
                <span class="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Urbino -->
    <section v-if="groupedCharacters['Urbino'].length > 0" class="w-full mt-8 relative">
       <div class="flex items-center justify-between mb-8 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-2xl bg-[#eefcfd] dark:bg-blue-500/20 text-blue-500 flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined">apartment</span>
          </div>
          <div class="flex flex-col">
            <h2 class="text-2xl font-bold text-text-dark dark:text-white">Urbino</h2>
            <span class="text-xs font-bold text-gray-400 tracking-widest uppercase">乌尔比诺</span>
          </div>
        </div>
      </div>
      <div class="w-full overflow-x-auto scrollbar-hide snap-x-mandatory pb-8 px-6 lg:px-12">
        <div class="flex gap-6 w-max">
           <NuxtLink v-for="char in groupedCharacters['Urbino']" :key="char.id" class="group glass-panel bg-white/40 dark:bg-white/5 rounded-[2rem] overflow-hidden card-hover-effect relative w-72 md:w-80 snap-center flex-shrink-0" :to="`/characters/${char.id}`">
            <div class="aspect-[3/4] w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-blue-500/10 dark:to-gray-900 border-b border-white/20">
              <img :src="char.icon" :alt="char.name" class="absolute inset-0 w-full h-full object-contain p-8 object-center transition-transform duration-700 group-hover:scale-110"/>
            </div>
             <div class="p-5 relative z-10">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors capitalize">{{ char.id }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ char.name }}</p>
                </div>
                 <span class="material-symbols-outlined text-gray-300 group-hover:text-blue-500 transition-colors">arrow_forward</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Opal -->
    <section v-if="groupedCharacters['Opal'].length > 0" class="w-full mt-8 mb-8 relative">
       <div class="flex items-center justify-between mb-8 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-2xl bg-[#fff5fa] dark:bg-purple-500/20 text-purple-500 flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined">diamond</span>
          </div>
          <div class="flex flex-col">
            <h2 class="text-2xl font-bold text-text-dark dark:text-white">Opal</h2>
            <span class="text-xs font-bold text-gray-400 tracking-widest uppercase">欧泊</span>
          </div>
        </div>
      </div>
       <div class="w-full overflow-x-auto scrollbar-hide snap-x-mandatory pb-8 px-6 lg:px-12">
         <div class="flex gap-6 w-max">
            <NuxtLink v-for="char in groupedCharacters['Opal']" :key="char.id" class="group glass-panel bg-white/40 dark:bg-white/5 rounded-[2rem] overflow-hidden card-hover-effect relative w-72 md:w-80 snap-center flex-shrink-0" :to="`/characters/${char.id}`">
            <div class="aspect-[3/4] w-full relative overflow-hidden bg-gradient-to-br from-purple-50 to-white dark:from-purple-500/10 dark:to-gray-900 border-b border-white/20">
              <img :src="char.icon" :alt="char.name" class="absolute inset-0 w-full h-full object-contain p-8 object-center transition-transform duration-700 group-hover:scale-110"/>
            </div>
             <div class="p-5 relative z-10">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors capitalize">{{ char.id }}</h3>
                   <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ char.name }}</p>
                </div>
                 <span class="material-symbols-outlined text-gray-300 group-hover:text-purple-500 transition-colors">arrow_forward</span>
              </div>
            </div>
          </NuxtLink>
         </div>
       </div>
    </section>
    
    <!-- Others / P.U.S -->
    <section v-if="groupedCharacters['Others'].length > 0" class="w-full mt-8 mb-8 relative">
       <div class="flex items-center justify-between mb-8 px-6 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined">group</span>
          </div>
          <div class="flex flex-col">
            <h2 class="text-2xl font-bold text-text-dark dark:text-white">Others</h2>
            <span class="text-xs font-bold text-gray-400 tracking-widest uppercase">其他</span>
          </div>
        </div>
      </div>
       <div class="w-full overflow-x-auto scrollbar-hide snap-x-mandatory pb-8 px-6 lg:px-12">
         <div class="flex gap-6 w-max">
            <NuxtLink v-for="char in groupedCharacters['Others']" :key="char.id" class="group glass-panel bg-white/40 dark:bg-white/5 rounded-[2rem] overflow-hidden card-hover-effect relative w-72 md:w-80 snap-center flex-shrink-0" :to="`/characters/${char.id}`">
            <div class="aspect-[3/4] w-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-gray-900 border-b border-white/20">
              <img :src="char.icon" :alt="char.name" class="absolute inset-0 w-full h-full object-contain p-8 object-center transition-transform duration-700 group-hover:scale-110"/>
            </div>
             <div class="p-5 relative z-10">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors capitalize">{{ char.id }}</h3>
                   <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ char.name }}</p>
                </div>
                 <span class="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">arrow_forward</span>
              </div>
            </div>
          </NuxtLink>
         </div>
       </div>
    </section>

  </main>
  
  <footer class="w-full flex flex-col items-center py-12 text-center relative z-10 border-t border-white/20">
    <div class="mb-4 text-2xl font-bold tracking-tight text-text-dark dark:text-white">Strinova <span class="text-primary">CC</span></div>
    <div class="flex gap-6 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
      <a class="hover:text-primary transition-colors" href="#">Privacy</a>
      <a class="hover:text-primary transition-colors" href="#">Terms</a>
      <a class="hover:text-primary transition-colors" href="#">Contact</a>
    </div>
    <p class="text-gray-400 text-xs font-medium max-w-md px-6">© 2023 Strinova Command Center. Data provided for entertainment purposes. Not affiliated with the official game developers.</p>
  </footer>
</div>
</template>

<style scoped>
.bg-gradient-animated {
    background: linear-gradient(-45deg, #fff0f3, #fcecee, #eefcfd, #fff5fa);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    background-attachment: fixed;
}
.dark .bg-gradient-animated {
    background: linear-gradient(-45deg, #2a141a, #1f0f13, #150a0d, #251016);
    background-size: 400% 400%;
}
@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.card-hover-effect {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.card-hover-effect:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px -5px rgba(238, 43, 91, 0.2);
}
.snap-x-mandatory {
    scroll-snap-type: x mandatory;
}
.snap-center {
    scroll-snap-align: center;
}
</style>
