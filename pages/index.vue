<template>
  <div class="min-h-screen bg-bg-core text-text-main font-rajdhani flex flex-col">
    <!-- Navbar -->
    <header class="h-16 border-b border-border-color flex items-center px-6 bg-bg-panel z-10 shadow-md">
      <div class="text-2xl font-orbitron font-bold text-primary tracking-wider">
        STRINOVA <span class="text-white text-base font-rajdhani font-normal">DATA VISUALIZATION MVP</span>
      </div>
      <div class="ml-auto flex items-center gap-4">
        <div class="text-xs text-text-muted">
          Last Updated: {{ store.lastUpdated ? new Date(store.lastUpdated).toLocaleDateString() : 'N/A' }}
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex overflow-hidden">
      <!-- Sidebar / Details Panel (Right side is usually detail in this layout, let's put control left or right) -->
      <!-- Let's do: Left Main Chart, Right Details/Radar -->
      
      <div class="flex-1 flex flex-col p-4 gap-4 relative">
        <!-- Controls Overlay -->
        <div class="absolute top-6 left-6 z-10 flex gap-2">
           <select 
             v-model="store.filterType"
             class="bg-bg-panel border border-border-color text-sm px-3 py-1 rounded focus:border-primary outline-none"
           >
             <option v-for="t in store.weaponTypes" :key="t" :value="t">{{ t }}</option>
           </select>
        </div>

        <!-- Scatter Plot Container -->
        <div class="flex-1 bg-bg-panel border border-border-color rounded-lg p-4 relative overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.05)]">
           <h2 class="absolute top-4 right-4 text-text-muted text-sm font-bold uppercase tracking-widest opacity-50">Weapon Meta Distribution</h2>
           <VizScatterPlot 
             :weapons="store.filteredWeapons" 
             :selected-id="store.selectedWeaponId"
             @select="store.selectWeapon"
           />
        </div>
      </div>

      <!-- Right Panel: Details & Radar -->
      <aside class="w-96 bg-bg-panel border-l border-border-color flex flex-col overflow-y-auto">
        <div class="p-6 border-b border-border-color">
          <h2 class="text-xl font-orbitron font-bold text-white mb-1">
             {{ store.selectedWeapon?.name || 'SELECT WEAPON' }}
          </h2>
          <div class="text-primary text-sm uppercase tracking-wider mb-4">
             {{ store.selectedWeapon?.type || 'Waiting for input...' }}
          </div>
          
          <div class="aspect-square bg-bg-core rounded border border-border-color relative mb-4">
             <!-- Radar Chart -->
             <VizRadarChart 
               :weapon="store.selectedWeapon"
               :compare-weapon="store.compareWeapon"
             />
             <div class="absolute bottom-2 right-2 text-[10px] text-text-muted">Spec Radar</div>
          </div>
          
          <div v-if="store.selectedWeapon" class="space-y-3">
             <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="bg-bg-core p-2 rounded border border-border-color">
                    <div class="text-text-muted text-xs">DPS (Body)</div>
                    <div class="text-accent font-bold text-lg">{{ Math.round(store.selectedWeapon.computed.dps_body) }}</div>
                </div>
                <div class="bg-bg-core p-2 rounded border border-border-color">
                    <div class="text-text-muted text-xs">TTK (Ref)</div>
                    <div class="text-white font-bold text-lg">--</div>
                </div>
                <div class="bg-bg-core p-2 rounded border border-border-color">
                    <div class="text-text-muted text-xs">Damage</div>
                    <div class="text-secondary font-bold text-lg">{{ store.selectedWeapon.stats.damage_body }}</div>
                </div>
                <div class="bg-bg-core p-2 rounded border border-border-color">
                    <div class="text-text-muted text-xs">Fire Rate</div>
                    <div class="text-primary font-bold text-lg">{{ store.selectedWeapon.stats.fire_rate }}</div>
                </div>
             </div>
             
             <!-- Comparison Toggle (Mockup) -->
             <div class="mt-4 pt-4 border-t border-border-color">
                <label class="flex items-center gap-2 text-xs text-text-muted cursor-pointer hover:text-white">
                   <input type="checkbox" disabled class="accent-primary"> Compare Mode (Coming Soon)
                </label>
             </div>
          </div>
          <div v-else class="text-sm text-text-muted italic text-center py-10 opacity-50">
             Click on a node in the scatter plot to view detailed analysis.
          </div>
        </div>
        
        <!-- Footer / Credits -->
        <div class="mt-auto p-4 text-center text-[10px] text-text-muted opacity-30">
           STRINOVA ANALYTICS MVP // DATA FROM WIKI // V1.0
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDataStore } from '~/stores/data';

const store = useDataStore();

onMounted(() => {
    store.fetchData();
});
</script>
