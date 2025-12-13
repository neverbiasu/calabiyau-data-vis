<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id as string;
const { getCharacterById, getWeaponById, getFaction, fetchData, isLoading } = useStrinovaData();

onMounted(() => {
    fetchData();
});

const character = computed(() => getCharacterById(id));

// Fallback / Mock Data for specific characters if real data is missing detailed stats/abilities
const MOCK_DATA: Record<string, any> = {
    'kanami': {
        bio: 'A cheerful and energetic idol who uses her songs to heal others. As a member of "The Scissors", Kanami brings hope to the battlefield with her melodies, turning the tide of combat with her sonic abilities.',
        role: 'Vanguard / 先锋', // Scraper says Unknown
        stats: { hp: 200, armor: 75, mobility: 105 },
        abilities: [
            { name: 'Resonance', type: 'Passive', description: 'Healing nearby allies slowly.', stats: { 'Heal': '5HP/s', 'Range': '10m' }, icon: 'auto_fix_high' },
            { name: 'Sonic Pulse', type: 'Active', description: 'Reveal enemies and slow them.', stats: { 'Cooldown': '15s', 'Duration': '4s', 'Slow': '30%' }, icon: 'volume_up' },
            { name: 'Stage Presence', type: 'Ultimate', description: 'Massive AOE heal & jam zone.', stats: { 'Cost': '120 Energy', 'Duration': '8s', 'Range': '35m' }, icon: 'spatial_audio' }
        ],
        weaponId: 'curtain_call' // 谢幕曲
    }
};

const displayData = computed(() => {
    const real = character.value;
    const mock = MOCK_DATA[id.toLowerCase()] || {};
    
    if (!real) return null;

    return {
        id: real.id,
        name: real.name,
        // Prefer real portrait, then real icon
        image: real.images?.portrait || real.icon,
        // Prefer real faction, then helper
        faction: (real.faction && real.faction !== 'Unknown') ? real.faction : getFaction(real.id),
        // Prefer mock bio/role/stats if real is missing or empty
        role: (real.role && real.role !== 'Unknown') ? real.role : (mock.role || 'Agent'),
        bio: real.bio || mock.bio || 'Data encrypted. Clearance level insufficient.',
        stats: (real.stats && real.stats.hp > 0) ? real.stats : (mock.stats || { hp: 100, armor: 0, mobility: 100 }),
        abilities: (real.abilities && real.abilities.length > 0) ? real.abilities : (mock.abilities || []),
        weapon: mock.weaponId ? getWeaponById(mock.weaponId) : null
    };
});

// Faction styling/colors
const factionColor = computed(() => {
    const f = displayData.value?.faction;
    if (f === 'The Scissors') return 'bg-[#ffeaef] text-primary';
    if (f === 'Urbino') return 'bg-[#eefcfd] text-blue-500';
    if (f === 'Opal') return 'bg-[#fff5fa] text-purple-500';
    return 'bg-gray-100 text-gray-500';
});

const factionIcon = computed(() => {
    const f = displayData.value?.faction;
    if (f === 'The Scissors') return 'content_cut';
    if (f === 'Urbino') return 'apartment';
    if (f === 'Opal') return 'diamond';
    return 'group';
});

</script>

<template>
<div class="bg-background-light dark:bg-background-dark font-display text-[#1b0d11] min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white">
  <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f3e7ea] bg-surface-light px-6 py-3 sticky top-0 z-50 shadow-sm glass-panel">
    <div class="flex items-center gap-8">
      <div class="flex items-center gap-4 text-[#1b0d11]">
        <div class="size-9 rounded-full bg-primary flex items-center justify-center text-white shadow-soft">
          <span class="material-symbols-outlined text-[20px]">data_usage</span>
        </div>
        <h2 class="text-[#1b0d11] text-lg font-extrabold leading-tight tracking-tight">Strinova Archive</h2>
      </div>
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink class="text-[#554a4d] text-sm font-semibold leading-normal hover:text-primary transition-colors flex items-center gap-1" to="/">
          <span class="material-symbols-outlined text-[18px]">home</span> Home
        </NuxtLink>
        <NuxtLink class="text-primary text-sm font-bold leading-normal bg-primary-soft px-3 py-1.5 rounded-full" to="/characters">Characters</NuxtLink>
        <NuxtLink class="text-[#554a4d] text-sm font-semibold leading-normal hover:text-primary transition-colors" to="/weapons">Weapons</NuxtLink>
      </div>
    </div>
    <!-- Search removed for brevity in detail page -->
  </header>

  <div v-if="isLoading && !displayData" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="!displayData" class="flex-1 flex items-center justify-center flex-col gap-4">
      <span class="material-symbols-outlined text-6xl text-gray-300">error</span>
      <h2 class="text-xl font-bold text-gray-500">Character Data Not Found</h2>
      <NuxtLink to="/characters" class="text-primary hover:underline">Return to Index</NuxtLink>
  </div>

  <main v-else class="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-10 gap-8 flex flex-col lg:flex-row items-start">
    <aside class="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-4 relative shrink-0 lg:sticky lg:top-24 h-auto lg:h-[calc(100vh-8rem)]">
      <div class="flex flex-wrap gap-2 px-2 items-center mb-2">
        <NuxtLink class="text-[#9a4c5f] text-xs font-bold hover:text-primary transition-colors flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm" to="/">
          <span class="material-symbols-outlined text-[14px]">home</span> Home
        </NuxtLink>
        <span class="text-[#9a4c5f]/40 text-xs font-bold">/</span>
        <NuxtLink class="text-[#9a4c5f] text-xs font-bold hover:text-primary transition-colors" to="/characters">Characters</NuxtLink>
        <span class="text-[#9a4c5f]/40 text-xs font-bold">/</span>
        <span class="text-primary text-xs font-black uppercase tracking-wide">{{ displayData.id }}</span>
      </div>
      
      <div class="relative w-full h-full min-h-[500px] lg:min-h-0 rounded-[2.5rem] overflow-hidden bg-white shadow-soft group border-[3px] border-white ring-1 ring-primary/10">
        <!-- Dynamic Background based on Faction? Defaulting to white/soft gradient for now to support transparent PNGs -->
        <div class="absolute inset-0 bg-gradient-to-br from-white via-[#fff0f5] to-[#f0f8ff]"></div>
        
        <div class="absolute inset-0 flex items-end justify-center pb-0 z-10">
          <img 
            :src="displayData.image" 
            :alt="displayData.name"
            class="w-full h-full object-contain object-bottom transition-transform duration-700 ease-out group-hover:scale-105 p-4"
            style="filter: drop-shadow(0 10px 20px rgba(0,0,0, 0.1));"
          />
        </div>
        
        <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white/95 via-white/80 to-transparent pt-32 z-20 backdrop-blur-[2px]">
          <div class="flex flex-col items-center text-center">
            <h1 class="font-jp text-[#1b0d11] text-[48px] md:text-[64px] font-black leading-[1] tracking-tight drop-shadow-sm mb-1">{{ displayData.name }}</h1>
            <div class="flex items-center gap-3">
              <span class="text-primary text-xl font-bold tracking-widest uppercase">{{ displayData.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col gap-6 w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section class="bg-white rounded-[2rem] p-6 shadow-card hover:shadow-soft transition-shadow border border-white">
          <div class="flex justify-between items-start mb-4">
            <div class="flex flex-col">
              <span class="text-xs font-bold text-[#9a4c5f] uppercase tracking-wider mb-1">Role</span>
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary p-1.5 rounded-lg">
                  <span class="material-symbols-outlined text-lg">shield</span>
                </div>
                <span class="font-jp font-bold text-lg text-[#1b0d11]">{{ displayData.role }}</span>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-xs font-bold text-[#9a4c5f] uppercase tracking-wider mb-1">Faction</span>
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm text-[#1b0d11]">{{ displayData.faction }}</span>
                <div class="size-8 rounded-full flex items-center justify-center border border-primary/20" :class="factionColor">
                  <span class="material-symbols-outlined text-lg">{{ factionIcon }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-sm font-bold text-[#1b0d11] mb-2 flex items-center gap-2">
              <span class="w-1 h-4 bg-primary rounded-full"></span>
                            Biography
            </h3>
            <p class="text-sm text-[#554a4d] leading-relaxed">
                {{ displayData.bio }}
            </p>
          </div>
        </section>

        <section class="bg-white rounded-[2rem] p-6 shadow-card hover:shadow-soft transition-shadow border border-white">
          <h3 class="text-lg font-bold text-[#1b0d11] mb-5 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">ecg_heart</span>
                         Survival Stats
          </h3>
          <div class="space-y-5">
            <div>
              <div class="flex justify-between items-end mb-1.5">
                <span class="text-xs font-bold text-[#9a4c5f] uppercase">Hit Points</span>
                <span class="text-sm font-black text-[#1b0d11]">{{ displayData.stats.hp }}</span>
              </div>
              <div class="h-3 w-full bg-[#f3e7ea] rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[#8fd3f4] to-[#84fab0] rounded-full shadow-[0_0_10px_rgba(132,250,176,0.5)]" :style="`width: ${(displayData.stats.hp / 300) * 100}%`"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-end mb-1.5">
                <span class="text-xs font-bold text-[#9a4c5f] uppercase">Armor</span>
                <span class="text-sm font-black text-[#1b0d11]">{{ displayData.stats.armor }}</span>
              </div>
              <div class="h-3 w-full bg-[#f3e7ea] rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-[#fccb90] to-[#d57eeb] rounded-full shadow-[0_0_10px_rgba(213,126,235,0.5)]" :style="`width: ${(displayData.stats.armor / 150) * 100}%`"></div>
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <div class="flex items-center gap-2">
                <div class="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                  <span class="material-symbols-outlined text-lg">sprint</span>
                </div>
                <span class="text-sm font-bold text-[#554a4d]">Mobility</span>
              </div>
              <span class="text-xl font-black text-[#1b0d11]">{{ displayData.stats.mobility }}</span>
            </div>
          </div>
        </section>
      </div>

      <section v-if="displayData.abilities.length > 0" class="bg-white rounded-[2rem] p-6 md:p-8 shadow-card border border-white">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-[#1b0d11] flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">bolt</span>
                        Abilities
          </h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="ability in displayData.abilities" :key="ability.name" class="group relative bg-[#fcf8f9] rounded-2xl p-4 border border-[#f3e7ea] hover:border-primary/30 hover:shadow-md transition-all cursor-pointer overflow-hidden">
            <div class="flex flex-col items-center text-center gap-3 relative z-10">
              <div class="size-12 rounded-full bg-white shadow-sm flex items-center justify-center border-2" :class="ability.type === 'Ultimate' ? 'border-[#d57eeb] text-[#d57eeb]' : 'border-primary text-primary'">
                <img v-if="ability.image" :src="ability.image" class="w-full h-full object-cover rounded-full" />
                <span v-else class="material-symbols-outlined">{{ (ability as any).icon || 'star' }}</span>
              </div>
              <div>
                <h4 class="font-bold text-[#1b0d11] text-sm">{{ ability.name }}</h4>
                <p class="text-xs text-[#9a4c5f] font-bold uppercase">{{ ability.type }}</p>
                <p class="text-xs text-[#554a4d] mt-1">{{ ability.description }}</p>
              </div>
            </div>
            <!-- Stats Overlay -->
            <div v-if="ability.stats" class="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity z-20 p-4 text-center">
              <p class="text-xs font-bold text-primary mb-1">DATA</p>
              <p v-for="(val, key) in ability.stats" :key="key" class="text-xs text-[#1b0d11]">{{ key }}: {{ val }}</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="displayData.weapon" class="bg-gradient-to-r from-primary to-[#ff6b95] rounded-[2rem] p-1 shadow-lg group">
        <div class="bg-white rounded-[1.8rem] p-4 flex flex-col md:flex-row items-center gap-6 h-full relative overflow-hidden">
          <div class="absolute -right-10 top-0 bottom-0 w-40 bg-gradient-to-l from-[#fff0f5] to-transparent skew-x-12 opacity-50 pointer-events-none"></div>
          <div class="size-20 shrink-0 bg-[#221015] rounded-2xl flex items-center justify-center text-white shadow-lg relative z-10">
            <img v-if="displayData.weapon.imgs?.weapon" :src="displayData.weapon.imgs.weapon" class="w-full h-full object-contain p-2"/>
            <span v-else class="material-symbols-outlined text-4xl">token</span>
          </div>
          <div class="flex-1 flex flex-col text-center md:text-left z-10">
            <span class="text-xs font-bold text-[#9a4c5f] uppercase tracking-wider mb-1">Signature Weapon</span>
            <h3 class="text-2xl font-black text-[#1b0d11] leading-tight">{{ displayData.weapon.name }}</h3>
            <p class="text-sm font-medium text-[#554a4d]">{{ displayData.weapon.type }}</p>
          </div>
          <NuxtLink class="w-full md:w-auto bg-[#221015] hover:bg-primary text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-md z-10 whitespace-nowrap" :to="`/weapons/${displayData.weapon.id}`">
            <span>Analyze</span>
            <span class="material-symbols-outlined text-sm font-bold">arrow_forward_ios</span>
          </NuxtLink>
        </div>
      </section>

    </div>
  </main>
</div>
</template>

<style scoped>
.glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
}
</style>
