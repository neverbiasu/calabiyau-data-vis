<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string
  options: { label: string; value: string }[]
  color?: string // 'primary' or 'rose' or custom hex
}>()

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const selectedLabel = computed(() => {
  return props.options.find(o => o.value === props.modelValue)?.label || 'Select Weapon'
})

const toggle = () => {
    isOpen.value = !isOpen.value
}

const select = (val: string) => {
    emit('update:modelValue', val)
    isOpen.value = false
}
</script>

<template>
  <div class="relative min-w-[240px]" :class="{ 'z-50': isOpen }">
    <!-- Trigger Button -->
    <button 
      @click="toggle"
      class="flex w-full items-center justify-between rounded-xl bg-surface-light px-4 py-3 text-left font-bold text-text-dark shadow-sm ring-1 ring-white/10 transition-all hover:bg-surface-lighter hover:ring-white/30"
      :class="[
        isOpen ? 'ring-2 ring-primary-500 bg-surface-lighter' : ''
      ]"
      :style="isOpen ? { borderColor: color, boxShadow: `0 0 0 2px ${color}` } : {}"
    >
      <span class="truncate">{{ selectedLabel }}</span>
      <span 
          class="material-symbols-outlined ml-2 transition-transform duration-300"
          :class="{ 'rotate-180': isOpen }"
          :style="{ color: color || '#8b5cf6' }"
      >
        expand_more
      </span>
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen"
      class="absolute left-0 top-[calc(100%+8px)] z-50 max-h-[300px] w-full overflow-hidden rounded-xl border border-white/10 bg-background-dark/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5"
    >
      
      <!-- Options List -->
      <div class="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
          <button
            v-for="opt in options"
            :key="opt.value"
            @click="select(opt.value)"
            class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/10"
            :class="[
                modelValue === opt.value ? 'bg-white/10' : 'text-text-dark dark:text-gray-300'
            ]"
            :style="modelValue === opt.value ? { color: color || '#8b5cf6' } : {}"
          >
             <span class="truncate" :class="{ 'font-bold': modelValue === opt.value }">{{ opt.label }}</span>
             <span 
                v-if="modelValue === opt.value" 
                class="material-symbols-outlined text-sm"
                :style="{ color: color || '#8b5cf6' }"
             >check</span>
          </button>
      </div>

    </div>
    
    <!-- Backdrop for click outside (Generic simple implementation) -->
    <div v-if="isOpen" class="fixed inset-0 z-40 bg-transparent" @click="toggle"></div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
