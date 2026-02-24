import { supabase } from '@/lib/supabase';

export async function uploadProfileImage(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/avatar_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('seller-profile-images')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('seller-profile-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
