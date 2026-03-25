'use server'
import { createClient } from '../utils/supabase/server'


export async function getSignedUrl(storage_path: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.storage.from('attachments').createSignedUrl(storage_path, 60)

    if (error) {
        return { error: "Fail to load url" }
    }

    return { data, error }
}