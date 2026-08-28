'use client'

/**
 * PURPOSE:
 * Updates or removes a user's avatar image in Supabase storage and updates avatar_url in the profile table.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/profiles.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing userId, posterFile, and originalPath.
 *   - userId (string, Required): The target user profile ID string.
 *   - posterFile (File | null, Required): New avatar File object to upload, or null if deleting avatar.
 *   - originalPath (string | null, Required): Path of previously uploaded avatar to remove from storage.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * If posterFile is provided, uploads file to storage bucket 'attachments', removes existing file at originalPath,
 * and updates avatar_url in table 'profiles'. If posterFile is null, deletes originalPath file and sets avatar_url to null.
 *
 * PARAMETERS:
 * - { userId, posterFile, originalPath }: Parameters for user ID, new poster file, and old avatar storage path.
 *
 * RETURN VALUE:
 * - Promise<{ error: string | null }>: Object containing error message or null on success.
 */
export async function updateProfileAvatar({ userId, posterFile, originalPath }: { userId: string, posterFile: File | null, originalPath: string | null }) {
    const supabase = createClient();
    let posterPath = null
    if (posterFile != null) {
        posterPath = `${userId}/${Date.now()}-${posterFile.name}`;

        if (originalPath) {
            const { error } = await supabase.storage.from('attachments').remove([originalPath])
        }
        const { error: storageError } = await supabase.storage.from('attachments').upload(posterPath, posterFile);
        if (storageError) {
            return { error: "Failed to upload to storage" }
        }

        const { error } = await supabase.from('profiles').update({ avatar_url: posterPath }).eq('id', userId)
        if (error) {
            return { error: "Failed to update image, please contact staff" }
        }
        return { error: null }
    }

    if (originalPath) {
        const { error } = await supabase.storage.from('attachments').remove([originalPath])
    }
    const { error } = await supabase.from('profiles').update({ avatar_url: null }).eq('id', userId)
    if (error) {
        return { error: "Failed to update image, please contact staff" }
    }
    return { error }
}
