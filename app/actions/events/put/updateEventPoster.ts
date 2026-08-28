'use client'

/**
 * PURPOSE:
 * Updates or removes the event poster image in Supabase storage and updates poster_path on the event record.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/events.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing eventId, posterFile, and originalPath.
 *   - eventId (string, Required): The target event ID string.
 *   - posterFile (File | null, Required): New poster image File object to upload, or null if removing.
 *   - originalPath (string | null, Required): Path of previously uploaded poster file to delete from storage.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * If a new posterFile is provided, uploads it to storage bucket 'attachments', removes any existing poster file at originalPath,
 * and updates poster_path in table 'events'. If posterFile is null, removes originalPath from storage and sets poster_path to null.
 *
 * PARAMETERS:
 * - { eventId, posterFile, originalPath }: Parameters for event ID, new poster file, and old poster storage path.
 *
 * RETURN VALUE:
 * - Promise<{ error: string | PostgrestError | null }>: Object containing error message/detail or null on success.
 */
export async function updateEventPoster({ eventId, posterFile, originalPath }: { eventId: string, posterFile: File | null, originalPath: string | null }) {
    const supabase = createClient();
    let posterPath = null
    if (posterFile != null) {
        posterPath = `${eventId}/${Date.now()}-${posterFile.name}`;

        if (originalPath) {
            const { error } = await supabase.storage.from('attachments').remove([originalPath])
        }
        const { error: storageError } = await supabase.storage.from('attachments').upload(posterPath, posterFile);
        if (storageError) {
            return { error: "Failed to upload to storage" }
        }

        const { error } = await supabase.from('events').update({ poster_path: posterPath }).eq('id', eventId)
        if (error) {
            return { error: "Failed to update image, please contact staff" }
        }
        return { error: null }
    }

    if (originalPath) {
        const { error } = await supabase.storage.from('attachments').remove([originalPath])
    }
    const { error } = await supabase.from('events').update({ poster_path: null }).eq('id', eventId)
    if (error) {
        return { error: "Failed to update image, please contact staff" }
    }
    return { error }
}
