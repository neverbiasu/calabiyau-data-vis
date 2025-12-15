import { ref } from 'vue';
import type { RootData, Weapon, Character } from '~/types/data';

// Singleton state
const data = ref<RootData | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

export function useStrinovaData() {
  const fetchData = async () => {
    if (data.value) return; // Already loaded

    isLoading.value = true;
    error.value = null;

    try {
      console.log('Fetching Strinova data...');
      // Use $fetch for Nuxt compatibility (works better in SSR/Universal)
      const json = await $fetch<RootData>('/data.json');
      data.value = json;
      console.log('Data loaded successfully:', { 
        characters: json.characters?.length, 
        weapons: json.weapons?.length 
      });
    } catch (e: any) {
      error.value = e.message;
      console.error('Error fetching Strinova data:', e);
    } finally {
      isLoading.value = false;
    }
  };

  const getWeaponById = (id: string): Weapon | undefined => {
    return data.value?.weapons.find(w => w.id === id);
  };

  const getCharacterById = (id: string): Character | undefined => {
    return data.value?.characters.find(c => c.id === id);
  };
  
  const getWeaponsByCharacter = (charName: string): Weapon[] => {
      // Match by character name (Chinese) stored in weapon data
      return data.value?.weapons.filter(w => w.character === charName) || [];
  };
  
  const getCharacterByName = (name: string): Character | undefined => {
    return data.value?.characters.find(c => c.name === name);
  };
  
  const FACTION_MAP: Record<string, string> = {
    // Scissors
    'kokona': 'The Scissors', 'ming': 'The Scissors', 'fukuda': 'The Scissors', 
    'kanami': 'The Scissors', 'shinjia': 'The Scissors', 'yvette': 'The Scissors',
    
    // Urbino
    'meredith': 'Urbino', 'lawson': 'Urbino', 'fragrans': 'Urbino',
    'chiyo': 'Urbino', 'eika': 'Urbino', 'michelle': 'Urbino',
    
    // Opal
    'audrey': 'Opal', 'fuchsia': 'Opal', 'lawine': 'Opal', 
    'reiichi': 'Opal', 'nobunaga': 'Opal', 'celestia': 'Opal',
    
    // P.U.S (New?) or Unknown
    'madalena': 'P.U.S', 'galatea': 'P.U.S', 'mara': 'P.U.S'
  };
  
  const getFaction = (id: string): string => {
      if (!id) return 'Unknown';
      return FACTION_MAP[id.toLowerCase()] || 'Unknown';
  };

  return {
    data,
    isLoading,
    error,
    fetchData,
    getWeaponById,
    getCharacterById,
    getCharacterByName,
    getWeaponsByCharacter,
    getFaction
  };
}
