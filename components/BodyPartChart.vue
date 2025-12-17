<template>
  <div class="flex items-center justify-center p-4">
    <div class="relative w-64 h-96">
      <svg viewBox="0 0 200 400" class="w-full h-full drop-shadow-lg">
        <!-- Head -->
        <g class="group" @mouseenter="hover = 'head'" @mouseleave="hover = null">
            <path d="M100,50 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0" 
                  :fill="getColor(multipliers.head)" 
                  class="transition-colors duration-300 stroke-white stroke-2" />
            <text x="100" y="55" text-anchor="middle" fill="white" font-weight="bold" font-size="14">{{ Math.round(baseDamage * multipliers.head) }}</text>
        </g>
        
        <!-- Chest/Body -->
        <g class="group" @mouseenter="hover = 'chest'" @mouseleave="hover = null">
            <path d="M70,85 L130,85 L140,200 L60,200 Z" 
                  :fill="getColor(multipliers.chest)" 
                  class="transition-colors duration-300 stroke-white stroke-2" />
            <text x="100" y="150" text-anchor="middle" fill="white" font-weight="bold" font-size="16">{{ Math.round(baseDamage * multipliers.chest) }}</text>
        </g>

        <!-- Legs -->
        <g class="group" @mouseenter="hover = 'legs'" @mouseleave="hover = null">
             <path d="M60,205 L95,205 L95,380 L70,380 Z M105,205 L140,205 L130,380 L105,380 Z" 
                   :fill="getColor(multipliers.legs)" 
                   class="transition-colors duration-300 stroke-white stroke-2" />
             <text x="100" y="300" text-anchor="middle" fill="white" font-weight="bold" font-size="16">{{ Math.round(baseDamage * multipliers.legs) }}</text>
        </g>
      </svg>
      
      <!-- Legend -->
      <div class="absolute top-0 right-0 bg-white/80 backdrop-blur rounded p-2 text-xs shadow-sm">
          <div class="flex items-center gap-2 mb-1"><div class="w-3 h-3 rounded bg-rose-500"></div> Critical</div>
          <div class="flex items-center gap-2 mb-1"><div class="w-3 h-3 rounded bg-blue-500"></div> Standard</div>
          <div class="flex items-center gap-2"><div class="w-3 h-3 rounded bg-gray-400"></div> Reduced</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  multipliers: { head: number; chest: number; legs: number };
  baseDamage: number;
}>();

const hover = ref<string | null>(null);

const getColor = (multiplier: number) => {
    if (multiplier > 1.0) return '#f43f5e'; // rose-500 (High damage)
    if (multiplier < 1.0) return '#9ca3af'; // gray-400 (Low damage)
    return '#3b82f6'; // blue-500 (Standard)
};
</script>
