import { defineStore } from 'pinia';
import type { RootData, Weapon, Character } from '~/types/data';

export const useDataStore = defineStore('data', {
  state: () => ({
    weapons: [] as Weapon[],
    characters: [] as Character[],
    lastUpdated: '',
    selectedWeaponId: null as string | null,
    compareWeaponId: null as string | null, // For comparison mode
    loading: false,
    error: null as string | null,
    filterType: 'All', // 'All', 'Rifle', etc.
  }),
  
  getters: {
    selectedWeapon: (state) => state.weapons.find(w => w.id === state.selectedWeaponId),
    compareWeapon: (state) => state.weapons.find(w => w.id === state.compareWeaponId),
    
    filteredWeapons: (state) => {
      if (state.filterType === 'All') return state.weapons;
      return state.weapons.filter(w => w.type === state.filterType);
    },
    
    weaponTypes: (state) => {
        const types = new Set(state.weapons.map(w => w.type));
        return ['All', ...Array.from(types).sort()];
    }
  },
  
  actions: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await fetch('/data.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data: RootData = await response.json();
        
        this.weapons = data.weapons;
        this.characters = data.characters;
        this.lastUpdated = data.last_updated;
      } catch (e: any) {
        this.error = e.message;
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    
    selectWeapon(id: string) {
        if (this.selectedWeaponId === id) {
             this.selectedWeaponId = null; // Toggle off
        } else {
             this.selectedWeaponId = id;
        }
    },

    setCompareWeapon(id: string) {
        this.compareWeaponId = id;
    }
  }
});
