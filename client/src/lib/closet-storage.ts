import { ClothingItem, ClothingType, WeatherVibe } from './types';

const STORAGE_KEY = 'vibe_closet_items';

export const getItems = (): ClothingItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load items', error);
    return [];
  }
};

export const saveItem = (item: Omit<ClothingItem, 'id' | 'createdAt'>): ClothingItem => {
  const items = getItems();
  const newItem: ClothingItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  
  const updatedItems = [newItem, ...items];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
  return newItem;
};

export const deleteItem = (id: string) => {
  const items = getItems();
  const updated = items.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getRecommendation = (vibe: WeatherVibe): Partial<Record<ClothingType, ClothingItem>> => {
  const items = getItems();
  
  // Filter items that match the current vibe or have 'All' tag (conceptually, if we added 'All', but for now we just check if the vibe is in the array)
  // The prompt says: "matches that temp tag".
  
  const relevantItems = items.filter(item => item.weatherTags.includes(vibe));
  
  const types: ClothingType[] = ['Top', 'Bottom', 'Shoes', 'Accessory'];
  const outfit: Partial<Record<ClothingType, ClothingItem>> = {};
  
  types.forEach(type => {
    const typeItems = relevantItems.filter(item => item.type === type);
    if (typeItems.length > 0) {
      const random = typeItems[Math.floor(Math.random() * typeItems.length)];
      outfit[type] = random;
    }
  });
  
  return outfit;
};
