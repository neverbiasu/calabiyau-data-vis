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
      // In production/dev, fetch from the static JSON file in public/
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }
      const json = await response.json();
      data.value = json;
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
    getWeaponsByCharacter,
    getFaction
  };
}
