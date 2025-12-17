<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// @ts-ignore
// @ts-ignore
import RadarChart from '~/components/RadarChart.vue';
// @ts-ignore
import DamageLineChart from '~/components/DamageLineChart.vue';
// @ts-ignore
import BodyPartChart from '~/components/BodyPartChart.vue';

const route = useRoute();
const id = route.params.id as string;
const { getWeaponById, getCharacterByName, fetchData, isLoading } = useStrinovaData();

onMounted(() => {
    fetchData();
});

const weapon = computed(() => getWeaponById(id));
const character = computed(() => weapon.value ? getCharacterByName(weapon.value.character) : null);
const damageFalloffData = computed(() => weapon.value?.damage_falloff);
const bodyPartMultipliers = computed(() => weapon.value?.body_part_multipliers || { head: 1.5, chest: 1.0, legs: 0.8 });

// Radar Chart Data from Attributes (0-100)
const radarData = computed(() => {
    if (!weapon.value) return [];
    const a = weapon.value.attributes;
    return [
        { label: 'Accuracy', value: a.accuracy },
        { label: 'Handling', value: a.handling },
        { label: 'Aim Spd', value: a.aim_speed },
        { label: 'Reload', value: a.reload_speed },
        { label: 'Mobility', value: a.move_speed }
    ];
});

// DPS Calculation if missing
const computedStats = computed(() => {
    if (!weapon.value) return {};
    const w = weapon.value;
    const rpm = w.stats.fire_rate;
    const body = w.stats.damage_body;
    const head = w.stats.damage_head;
    
    // DPS = (RPM / 60) * Damage
    const dps = Math.round((rpm / 60) * body);
    
    return {
        dps,
        rpm,
        mag: w.stats.mag_capacity,
        reload: w.stats.reload_time + 's'
    };
});

</script>

<template>
<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-text-dark antialiased selection:bg-primary selection:text-white pt-24">
  <Navbar />

  <div v-if="isLoading && !weapon" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="!weapon" class="flex-1 flex items-center justify-center flex-col gap-4">
      <span class="material-symbols-outlined text-6xl text-gray-300">error</span>
      <h2 class="text-xl font-bold text-gray-500">Weapon Data Not Found</h2>
      <NuxtLink to="/weapons" class="text-primary hover:underline">Return to Index</NuxtLink>
  </div>

  <main v-else class="layout-container flex grow flex-col py-8 px-4 md:px-10 lg:px-40">
    <div class="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
      <div class="flex flex-wrap items-center gap-2 px-2">
        <NuxtLink class="text-text-muted hover:text-primary text-sm font-medium transition-colors" to="/">Home</NuxtLink>
        <span class="material-symbols-outlined text-text-muted text-[16px]">chevron_right</span>
        <NuxtLink class="text-text-muted hover:text-primary text-sm font-medium transition-colors" to="/weapons">Weapons</NuxtLink>
        <span class="material-symbols-outlined text-text-muted text-[16px]">chevron_right</span>
        <span class="text-text-dark text-sm font-bold bg-white px-3 py-1 rounded-full shadow-sm">{{ weapon.name }}</span>
      </div>
      <section class="relative overflow-hidden rounded-2xl bg-white p-6 shadow-kawaii md:p-8">
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-secondary/10 blur-2xl"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div class="group relative flex shrink-0 items-center justify-center">
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-md transition-all group-hover:blur-lg"></div>
            <div class="relative flex h-40 w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff0f6] to-white border border-white shadow-inner-soft">
              <NuxtImg :alt="weapon.name" class="h-32 w-32 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" :src="weapon.imgs.weapon" format="webp" />
            </div>
          </div>
          <div class="flex flex-1 flex-col items-center text-center md:items-start md:text-left gap-3">
            <h1 class="font-display text-3xl font-black tracking-tight text-text-dark md:text-5xl">{{ weapon.name }}</h1>
            <div class="flex flex-wrap justify-center gap-3 md:justify-start">
              <NuxtLink v-if="character" :to="`/characters/${character.id}`" class="group flex items-center gap-2 rounded-full bg-[#f4e6ed] py-1.5 pl-1.5 pr-4 transition-all hover:bg-primary hover:text-white hover:shadow-md">
                <div class="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-white">
                  <NuxtImg :alt="character.name" class="h-full w-full object-cover" :src="character.icon" format="webp" />
                </div>
                <span class="text-sm font-bold text-text-dark group-hover:text-white">{{ character.name }}</span>
                <span class="material-symbols-outlined text-[16px] group-hover:text-white opacity-50">link</span>
              </NuxtLink>
              <div class="flex items-center gap-2 rounded-full bg-secondary/20 py-1.5 px-4 text-sky-700">
                <span class="material-symbols-outlined text-[18px]">emergency_home</span>
                <span class="text-sm font-bold">{{ weapon.type }}</span>
              </div>
            </div>
            <p class="mt-2 max-w-lg text-sm text-text-muted">
                 {{ weapon.character }} uses this {{ weapon.type }} to dominate the battlefield.
            </p>
          </div>
          <div class="flex shrink-0 flex-col items-center">
            <div class="relative flex h-28 w-28 rotate-6 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-[#ff7eb6] shadow-lg shadow-primary/40 ring-4 ring-white transition-transform hover:rotate-0 hover:scale-105">
              <span class="font-display text-6xl font-black text-white drop-shadow-md">S</span>
              <div class="absolute -bottom-3 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">Tier</div>
              <span class="material-symbols-outlined absolute -right-2 -top-2 animate-pulse text-yellow-300 drop-shadow-sm" style="font-size: 32px;">spark</span>
            </div>
          </div>
        </div>
      </section>
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="col-span-1 flex flex-col rounded-2xl bg-white p-8 shadow-kawaii">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-lg font-bold text-text-dark">
              <span class="material-symbols-outlined text-primary">radar</span>
                                Analysis
                            </h3>
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">v1.0</span>
          </div>
          <div class="relative flex flex-1 items-center justify-center py-6 min-h-[320px]">
            <RadarChart :data="radarData" color="#ff9ecd" fill-color="rgba(255, 158, 205, 0.4)" />
          </div>
          <div class="mt-4 text-center">
            <p class="text-2xl font-black tracking-tight text-text-dark">Balanced</p>
            <p class="text-sm text-text-muted">Overall performance score</p>
          </div>
        </div>
        <div class="col-span-1 lg:col-span-2 flex flex-col gap-8">
          <!-- Key Metrics Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
             <!-- DPS Card -->
             <div class="col-span-2 md:col-span-2 rounded-2xl bg-white p-6 shadow-kawaii relative overflow-hidden group">
                 <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <span class="material-symbols-outlined text-8xl text-rose-500">flash_on</span>
                 </div>
                 <div class="relative z-10">
                     <div class="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">Damage Output</div>
                     <div class="flex items-baseline gap-2 mb-4">
                        <span class="text-5xl font-black text-text-dark">{{ computedStats.dps }}</span>
                        <span class="text-base font-bold text-text-muted">DPS</span>
                     </div>
                     <!-- DPS Bar -->
                     <div class="w-full h-3 bg-rose-50 rounded-full overflow-hidden">
                         <div class="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out" :style="{ width: Math.min((computedStats.dps / 600) * 100, 100) + '%' }"></div>
                     </div>
                     <p class="mt-3 text-xs text-text-muted">Based on body shots (Approx.)</p>
                 </div>
             </div>

             <!-- RPM Card -->
             <div class="col-span-1 rounded-2xl bg-white p-6 shadow-kawaii relative overflow-hidden group hover:-translate-y-1 transition-transform">
                 <div class="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Fire Rate</div>
                 <span class="text-4xl font-black text-text-dark block mb-1">{{ computedStats.rpm }}</span>
                 <span class="text-xs text-text-muted">RPM</span>
                 <div class="absolute right-2 bottom-2 text-blue-500 opacity-20">
                     <span class="material-symbols-outlined text-6xl">cyclone</span>
                 </div>
             </div>

             <!-- Mag Card -->
             <div class="col-span-1 rounded-2xl bg-white p-6 shadow-kawaii relative overflow-hidden group hover:-translate-y-1 transition-transform">
                 <div class="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Magazine</div>
                 <span class="text-4xl font-black text-text-dark block mb-1">{{ computedStats.mag }}</span>
                 <span class="text-xs text-text-muted">Rounds</span>
                 <div class="absolute right-2 bottom-2 text-purple-500 opacity-20">
                     <span class="material-symbols-outlined text-6xl">layers</span>
                 </div>
             </div>
          </div>
          
          <!-- Detailed Specs (Raw Stats) -->
          <div class="rounded-2xl bg-white shadow-kawaii overflow-hidden">
            <div class="border-b border-gray-100 bg-[#fff5f9] p-5 px-8">
                <h3 class="text-lg font-bold text-text-dark flex items-center gap-2">
                    <span class="material-symbols-outlined text-text-muted">table_chart</span>
                    Technical Specifications
                </h3>
            </div>
            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                <!-- Iterate Attributes for Bars -->
                <div v-for="(val, key) in weapon.attributes" :key="key" class="flex flex-col gap-2">
                    <div class="flex justify-between text-sm">
                        <span class="font-medium text-text-muted capitalize">{{ key.replace(/_/g, ' ') }}</span>
                        <span class="font-bold text-text-dark">{{ val }}</span>
                    </div>
                     <!-- Show bar for numeric 0-100 values -->
                    <div v-if="typeof val === 'number'" class="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div class="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                             :style="{ width: Math.min(Math.max(val, 5), 100) + '%' }"></div>
                    </div>
                </div>
                <!-- Extra Stats -->
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between text-sm">
                        <span class="font-medium text-text-muted">Reload Time</span>
                        <span class="font-bold text-text-dark">{{ weapon.stats.reload_time }}s</span>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between text-sm">
                        <span class="font-medium text-text-muted">Effective Range</span>
                        <span class="font-bold text-text-dark">{{ weapon.stats.range }}m</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Damage Analysis Section -->
      <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- Damage Falloff Chart -->
        <div class="col-span-1 lg:col-span-2 flex flex-col rounded-2xl bg-white p-8 shadow-kawaii min-h-[400px]">
             <div class="mb-6 flex items-center justify-between">
                <h3 class="flex items-center gap-2 text-lg font-bold text-text-dark">
                  <span class="material-symbols-outlined text-rose-500">show_chart</span>
                  Damage Falloff
                </h3>
             </div>
             <div class="flex-1 w-full">
                 <DamageLineChart :data="damageFalloffData" />
             </div>
             <p class="mt-4 text-center text-xs text-text-muted">Damage over distance (meters)</p>
        </div>

        <!-- Body Part Multipliers -->
        <div class="col-span-1 flex flex-col rounded-2xl bg-white p-8 shadow-kawaii">
             <div class="mb-6 flex items-center justify-between">
                <h3 class="flex items-center gap-2 text-lg font-bold text-text-dark">
                  <span class="material-symbols-outlined text-blue-500">accessibility_new</span>
                  Multipliers
                </h3>
             </div>
             <div class="flex-1 w-full flex items-center justify-center">
                 <BodyPartChart :multipliers="bodyPartMultipliers" :base-damage="weapon.stats.damage_body || 0" />
             </div>
        </div>
      </div>
    </div>
  </main>
</div>
</template>

<style scoped>
.material-symbols-outlined {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
/* Custom scrollbar for raw data table */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: #f4e6ed; 
}
::-webkit-scrollbar-thumb {
    background: #ff9ecd; 
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: #ff7eb6; 
}

.chart-grid {
    background-image: radial-gradient(#ff9ecd 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.1;
}
</style>
