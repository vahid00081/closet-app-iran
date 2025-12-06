import { supabase } from './supabase';
import { ClothingItem, ClothingType, WeatherVibe } from './types';

export const getItems = async (): Promise<ClothingItem[]> => {
  const { data, error } = await supabase
    .from('clothing_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching items:', error);
    return [];
  }

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
      imagePath: item.image_path
    };
  });
};

export const saveItem = async (
  file: File, 
  type: ClothingType, 
  weatherTags: WeatherVibe[],
  userId: string
): Promise<ClothingItem> => {
  // 1. Upload Image
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const filePath = fileName; 

  console.log("Attempting upload to 'closet-images' bucket:", filePath);

  const { error: uploadError } = await supabase.storage
    .from('closet-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error("❌ Supabase Storage Upload FAILED:", {
      message: uploadError.message,
      name: uploadError.name,
      // @ts-ignore
      statusCode: uploadError.statusCode,
    });
    throw new Error(`Storage Upload Failed: ${uploadError.message}`);
  }

  console.log("✅ Upload successful. Inserting database record...");

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

  if (insertError) {
     console.error("❌ Supabase DB Insert FAILED:", {
       message: insertError.message,
       details: insertError.details,
       hint: insertError.hint,
       code: insertError.code
     });
     
     // Cleanup: If DB fails, try to delete the uploaded image to avoid orphans
     await supabase.storage.from('closet-images').remove([filePath]);
     
     throw new Error(`Database Insert Failed: ${insertError.message}`);
  }

  console.log("✅ Database insert successful.");

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
};

export const deleteItem = async (id: string, imagePath?: string) => {
  try {
    const { error: dbError } = await supabase
      .from('clothing_items')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from('closet-images')
        .remove([imagePath]);
      
      if (storageError) console.warn('Failed to delete image file:', storageError);
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error; 
  }
};

export const getRecommendation = async (vibe: WeatherVibe): Promise<Partial<Record<ClothingType, ClothingItem>>> => {
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
