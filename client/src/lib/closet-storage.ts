import { supabase } from './supabase';
import { ClothingItem, ClothingType, WeatherVibe } from './types';

// We assume a table 'clothing_items' exists with columns:
// id (uuid), user_id (uuid), image_path (text), type (text), weather_tags (text[]), created_at (timestamp)

// We assume a storage bucket 'closet-images' exists.

export const getItems = async (): Promise<ClothingItem[]> => {
  const { data, error } = await supabase
    .from('clothing_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }

  // Transform data to match ClothingItem interface if needed
  // Assuming image_path is stored, we need to get the public URL
  return data.map((item: any) => {
    const { data: publicUrlData } = supabase.storage
      .from('closet-images')
      .getPublicUrl(item.image_path);

    return {
      id: item.id,
      imageUrl: publicUrlData.publicUrl,
      type: item.type as ClothingType,
      weatherTags: item.weather_tags as WeatherVibe[],
      createdAt: new Date(item.created_at).getTime(),
      imagePath: item.image_path // Keep this for deletion
    };
  });
};

export const saveItem = async (
  file: File, 
  type: ClothingType, 
  weatherTags: WeatherVibe[],
  userId: string
): Promise<ClothingItem | null> => {
  try {
    // 1. Upload Image
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('closet-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Insert Record
    const { data, error: insertError } = await supabase
      .from('clothing_items')
      .insert([
        {
          user_id: userId,
          image_path: filePath,
          type,
          weather_tags: weatherTags,
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 3. Return formatted item
    const { data: publicUrlData } = supabase.storage
      .from('closet-images')
      .getPublicUrl(filePath);

    return {
      id: data.id,
      imageUrl: publicUrlData.publicUrl,
      type: data.type as ClothingType,
      weatherTags: data.weather_tags as WeatherVibe[],
      createdAt: new Date(data.created_at).getTime(),
      imagePath: filePath
    };

  } catch (error) {
    console.error('Error saving item:', error);
    return null;
  }
};

export const deleteItem = async (id: string, imagePath?: string) => {
  try {
    // 1. Delete from DB
    const { error: dbError } = await supabase
      .from('clothing_items')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    // 2. Delete from Storage (if path provided)
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from('closet-images')
        .remove([imagePath]);
      
      if (storageError) console.warn('Failed to delete image file:', storageError);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

export const getRecommendation = async (vibe: WeatherVibe): Promise<Partial<Record<ClothingType, ClothingItem>>> => {
  // Since we need to filter by array contains, Supabase has an operator for that.
  // .contains('weather_tags', [vibe])
  
  const { data, error } = await supabase
    .from('clothing_items')
    .select('*')
    .contains('weather_tags', [vibe]);

  if (error) {
    console.error('Error fetching recommendations:', error);
    return {};
  }

  const items = data.map((item: any) => {
    const { data: publicUrlData } = supabase.storage
      .from('closet-images')
      .getPublicUrl(item.image_path);

    return {
      id: item.id,
      imageUrl: publicUrlData.publicUrl,
      type: item.type as ClothingType,
      weatherTags: item.weather_tags as WeatherVibe[],
      createdAt: new Date(item.created_at).getTime(),
      imagePath: item.image_path
    };
  });

  const types: ClothingType[] = ['Top', 'Bottom', 'Shoes', 'Accessory'];
  const outfit: Partial<Record<ClothingType, ClothingItem>> = {};

  types.forEach(type => {
    const typeItems = items.filter((item: ClothingItem) => item.type === type);
    if (typeItems.length > 0) {
      const random = typeItems[Math.floor(Math.random() * typeItems.length)];
      outfit[type] = random;
    }
  });

  return outfit;
};
