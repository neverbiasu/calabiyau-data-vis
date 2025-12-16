<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const { data, fetchData, isLoading } = useStrinovaData();
const searchQuery = ref('');
const activeFilter = ref('All');

const filters = ['All', 'Automatic', 'Semi-Auto', 'Sniper', 'Shotgun', 'Melee', 'Tactical'];

onMounted(() => {
  fetchData();
});

const filteredWeapons = computed(() => {
  if (!data.value) return [];
  
  let result = data.value.weapons;
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(w => 
      w.name.toLowerCase().includes(q) || 
      w.id.toLowerCase().includes(q) ||
      w.character.toLowerCase().includes(q)
    );
  }
  
  return result;
});
</script>

<template>
<div class="font-display bg-[#fcf8fa] dark:bg-[#1a0b10] text-[#1b0d11] dark:text-white min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-white pb-24">
  <Navbar />
  
  <main class="flex-grow flex flex-col items-center w-full z-10 pt-32 pb-12 gap-8 px-6 lg:px-12 max-w-7xl mx-auto">
    <section class="text-center space-y-4 w-full max-w-4xl">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-text-dark dark:text-white drop-shadow-sm">
            Armory <span class="text-primary">Showcase</span>
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 font-medium max-w-xl mx-auto">
            Select your gear and optimize your loadout.
      </p>
    </section>

    <!-- Search & Filter -->
    <div class="w-full flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-3xl bg-white/40 dark:bg-white/5">
        <div class="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
             <button 
                v-for="filter in filters" 
                :key="filter"
                class="px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap"
                :class="activeFilter === filter ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20'"
                @click="activeFilter = filter"
             >
                {{ filter }}
             </button>
        </div>
        <div class="relative w-full md:w-80">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search weapon name..." 
                class="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-black/20 border border-transparent focus:border-primary focus:ring-0 text-sm outline-none transition-all"
            >
        </div>
    </div>
    
    <div class="w-full flex justify-end">
         <button class="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-500 font-bold text-sm hover:bg-blue-100 transition-colors">
            <span class="material-symbols-outlined text-lg">sprint</span>
            View Movement Speed Table
         </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !data" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p class="text-gray-500">Loading armory data...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="!isLoading && !filteredWeapons.length && !searchQuery" class="flex flex-col items-center justify-center py-20 gap-4">
         <span class="material-symbols-outlined text-6xl text-gray-300">cloud_off</span>
        <h3 class="text-xl font-bold text-gray-500">Unable to load weapon data</h3>
        <button @click="fetchData()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Retry Connection
        </button>
    </div>

    <!-- Weapon Grid -->
    <section v-else class="w-full max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      <NuxtLink 
        v-for="weapon in filteredWeapons" 
        :key="weapon.id"
        :to="`/weapons/${weapon.id}`"
        class="group glass-panel bg-white/60 dark:bg-white/5 rounded-3xl p-4 card-hover-effect flex flex-col gap-4 relative overflow-hidden"
      >
        <div class="aspect-square rounded-2xl bg-gray-100 dark:bg-black/20 relative overflow-hidden flex items-center justify-center p-4">
            <NuxtImg 
                :src="weapon.imgs.weapon || '/placeholder-weapon.png'" 
                :alt="weapon.name" 
                class="w-full h-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                format="webp"
            />
            <div class="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-xs font-mono font-bold text-white uppercase">
                {{ weapon.type }}
            </div>
        </div>
        <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-tight">{{ weapon.name }}</h3>
             <p class="text-xs text-gray-400 font-mono mt-0.5">{{ weapon.id }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">{{ weapon.character }}</p>
        </div>
        
        <div class="w-full h-px bg-gray-200 dark:bg-white/10"></div>
        
        <div class="grid grid-cols-3 gap-2 text-center">
            <div class="flex flex-col">
                <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Fire Rate</span>
                <div class="flex items-center justify-center gap-1 font-bold text-gray-800 dark:text-gray-200">
                    <span class="material-symbols-outlined text-xs text-primary">bolt</span>
                    {{ weapon.stats.fire_rate }}
                </div>
            </div>
             <div class="flex flex-col">
                <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Damage</span>
                <div class="flex items-center justify-center gap-1 font-bold text-gray-800 dark:text-gray-200">
                    <span class="material-symbols-outlined text-xs text-primary">swords</span>
                    {{ weapon.stats.damage_body }}
                </div>
            </div>
             <div class="flex flex-col">
                <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mag</span>
                <div class="flex items-center justify-center gap-1 font-bold text-gray-800 dark:text-gray-200">
                    <span class="material-symbols-outlined text-xs text-primary">layers</span>
                    {{ weapon.stats.mag_capacity }}
                </div>
            </div>
        </div>
      </NuxtLink>



    </section>
  </main>
  
  <footer class="w-full flex flex-col items-center py-12 text-center relative z-10 border-t border-white/20">
    <div class="mb-4 text-2xl font-bold tracking-tight text-text-dark dark:text-white">Calabiyau <span class="text-primary">Data Vis</span></div>
    <div class="flex gap-6 mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
      <a class="hover:text-primary transition-colors" href="#">Privacy</a>
      <a class="hover:text-primary transition-colors" href="#">Terms</a>
      <a class="hover:text-primary transition-colors" href="#">Contact</a>
    </div>
    <p class="text-gray-400 text-xs font-medium max-w-md px-6">© 2025 Calabiyau Data Vis. Community Project.</p>
  </footer>
</div>
</template>

<style scoped>

.card-hover-effect {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.card-hover-effect:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px -5px rgba(238, 43, 91, 0.2);
}
</style>
