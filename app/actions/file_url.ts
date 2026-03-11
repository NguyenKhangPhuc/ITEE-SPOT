'use server'
import { createClient } from '../utils/supabase/server'


export async function getSignedUrl(storage_path: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.storage.from('attachments').createSignedUrl(storage_path, 60)

    if (error) {
        throw new Error(error.message)
    }

    return data
}