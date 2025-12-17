<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStrinovaData } from '~/composables/useStrinovaData'
import type { Weapon } from '~/types/data'
import DamageLineChart from '~/components/DamageLineChart.vue'
import BodyPartChart from '~/components/BodyPartChart.vue'
import WeaponSelector from '~/components/ui/WeaponSelector.vue'

const { data, fetchData } = useStrinovaData()

onMounted(() => {
    fetchData()
})

const weapons = computed(() => data.value?.weapons || [])
const weaponOptions = computed(() => weapons.value.map(w => ({ label: w.name, value: w.id })))

// Selection State
const leftId = ref<string>('investigator')
const rightId = ref<string>('phantom_frost') 

// Helpers
// Fallback weapon structure to prevent crashes if data is missing during transition
const EMPTY_WEAPON: any = {
    id: '', name: 'Loading', type: '', character: '',
    imgs: { weapon: '', character: '' }, 
    stats: { damage_body: 0, fire_rate: 0, mag_capacity: 0 },
    computed: { time_to_kill: 0 },
    damage_falloff: {},
    body_part_multipliers: { head: 0, chest: 0, legs: 0 }
}

const getWeapon = (id: string) => {
    if (!weapons.value.length) return null
    return weapons.value.find(w => w.id === id) || weapons.value[0]
}

const leftWeapon = computed(() => getWeapon(leftId.value) || EMPTY_WEAPON)
const rightWeapon = computed(() => getWeapon(rightId.value) || EMPTY_WEAPON)

// Comparison Logic
const statDiff = (stat: keyof Weapon['stats']) => {
  const l = leftWeapon.value.stats[stat] || 0
  const r = rightWeapon.value.stats[stat] || 0
  if (l === r) return 0
  return l > r ? 1 : -1
}

const formatDiff = (val: number) => val > 0 ? `+${val}` : `${val}`
</script>

<template>
  <div class="min-h-screen bg-transparent pb-24 pt-24">
    <Navbar />
    <!-- Loading State -->
    <div v-if="!data || !leftWeapon.id" class="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-white">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <div class="font-bold text-primary-300">Loading Weapon Database...</div>
    </div>

    <div v-else class="mx-auto max-w-[1400px] px-4 md:px-8">
      
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-black text-white drop-shadow-md">
          <span class="text-primary-400">Tactical</span> Comparison
        </h1>
        <p class="mt-2 text-text-muted">Analyze weapon performance side-by-side</p>
      </div>

      <!-- Control Bar -->
      <div class="relative z-20 mb-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 rounded-2xl bg-surface-dark/50 p-6 backdrop-blur-md">
         <!-- Left Selector -->
         <WeaponSelector 
             v-model="leftId" 
             :options="weaponOptions" 
             color="#3b82f6" 
             class="w-full md:flex-1 md:max-w-[300px]"
         />

         <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-lighter font-black text-text-muted">
             VS
         </div>

         <!-- Right Selector -->
         <WeaponSelector 
             v-model="rightId" 
             :options="weaponOptions" 
             color="#f43f5e" 
             class="w-full md:flex-1 md:max-w-[300px]"
         />
      </div>

      <!-- Main Comparison Grid -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        
        <!-- Left Weapon Card -->
        <div class="rounded-3xl border border-white/5 bg-surface-dark/80 p-8 backdrop-blur-xl transition-all hover:bg-surface-dark">
            <div class="mb-6 flex items-center justify-between">
                <div>
                     <div class="text-sm font-bold uppercase tracking-wider text-primary-400">{{ leftWeapon.type }}</div>
                     <h2 class="text-3xl font-black text-white">{{ leftWeapon.name }}</h2>
                </div>
                <!-- Image -->
                <div class="h-16 w-32 object-contain">
                     <img :src="leftWeapon.imgs.weapon" :alt="leftWeapon.name" class="h-full w-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>
            </div>
            
            <!-- Quick Stats -->
            <div class="mb-8 grid grid-cols-3 gap-4">
                 <div class="rounded-xl bg-surface-light p-4 text-center">
                     <div class="text-xs text-text-muted">Body DMG</div>
                     <div class="text-2xl font-bold text-gray-900">{{ leftWeapon.stats.damage_body }}</div>
                 </div>
                 <div class="rounded-xl bg-surface-light p-4 text-center">
                     <div class="text-xs text-text-muted">RPM</div>
                     <div class="text-2xl font-bold text-gray-900">{{ leftWeapon.stats.fire_rate }}</div>
                 </div>
                 <div class="rounded-xl bg-surface-light p-4 text-center">
                     <div class="text-xs text-text-muted">TTK</div>
                     <div class="text-2xl font-bold text-emerald-500">{{ leftWeapon.computed.time_to_kill }}s</div>
                 </div>
            </div>

            <!-- Damage Chart -->
            <div class="mb-8 rounded-xl bg-white p-4">
                 <h3 class="mb-4 text-sm font-bold text-gray-800">Damage Profile</h3>
                 <BodyPartChart 
                     :multipliers="leftWeapon.body_part_multipliers || { head: 1.5, chest: 1.0, legs: 0.8 }" 
                     :base-damage="leftWeapon.stats.damage_body" 
                 />
            </div>
        </div>

        <!-- Right Weapon Card -->
        <div class="rounded-3xl border border-white/5 bg-surface-dark/80 p-8 backdrop-blur-xl transition-all hover:bg-surface-dark">
            <div class="mb-6 flex items-center justify-between">
                <div>
                     <div class="text-sm font-bold uppercase tracking-wider text-rose-400">{{ rightWeapon.type }}</div>
                     <h2 class="text-3xl font-black text-white">{{ rightWeapon.name }}</h2>
                </div>
                <div class="h-16 w-32 object-contain">
                     <img :src="rightWeapon.imgs.weapon" :alt="rightWeapon.name" class="h-full w-full object-contain drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                </div>
            </div>
            
             <!-- Quick Stats -->
            <div class="mb-8 grid grid-cols-3 gap-4">
                 <div class="rounded-xl bg-surface-light p-4 text-center">
                     <div class="text-xs text-text-muted">Body DMG</div>
                     <div class="text-2xl font-bold text-gray-900">{{ rightWeapon.stats.damage_body }}</div>
                 </div>
                 <div class="rounded-xl bg-surface-light p-4 text-center">
                     <div class="text-xs text-text-muted">RPM</div>
                     <div class="text-2xl font-bold text-gray-900">{{ rightWeapon.stats.fire_rate }}</div>
                 </div>
                 <div class="rounded-xl bg-surface-light p-4 text-center">
                     <div class="text-xs text-text-muted">TTK</div>
                     <div class="text-2xl font-bold text-emerald-500">{{ rightWeapon.computed.time_to_kill }}s</div>
                 </div>
            </div>

             <!-- Damage Chart -->
            <div class="mb-8 rounded-xl bg-white p-4">
                 <h3 class="mb-4 text-sm font-bold text-gray-800">Damage Profile</h3>
                 <BodyPartChart 
                     :multipliers="rightWeapon.body_part_multipliers || { head: 1.5, chest: 1.0, legs: 0.8 }" 
                     :base-damage="rightWeapon.stats.damage_body" 
                 />
            </div>
        </div>

      </div>
      
      <!-- Shared Analysis (Bottom) -->
      <div class="mt-12 rounded-3xl bg-surface-dark/90 p-8">
           <h3 class="mb-6 text-xl font-bold text-white">Range Analysis (Damage Drop-off)</h3>
           <div class="h-[400px] w-full bg-white rounded-xl p-4">
               <!-- We can reuse DamageLineChart here but it only takes one dataset normally. 
                    Ideally we upgrade DamageLineChart to accept multiple datasets. For now, let's put two side by side? 
                    Or just show one for the "Left" weapon for now as a verified component. -->
               <div class="flex h-full w-full gap-4">
                   <div class="flex-1">
                       <p class="text-center font-bold text-primary-500 mb-2">{{ leftWeapon.name }}</p>
                       <DamageLineChart 
                           :data="leftWeapon.damage_falloff || {}" 
                       />
                   </div>
                   <div class="flex-1">
                       <p class="text-center font-bold text-rose-500 mb-2">{{ rightWeapon.name }}</p>
                        <DamageLineChart 
                           :data="rightWeapon.damage_falloff || {}" 
                       />
                   </div>
               </div>
           </div>
      </div>

    </div>
  </div>
</template>
