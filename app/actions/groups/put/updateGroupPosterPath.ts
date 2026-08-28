'use client'

/**
 * PURPOSE:
 * Updates or deletes a group poster image in Supabase storage and updates poster_path on the group record.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/groups.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing groupId, avatarFile, and originalPath.
 *   - groupId (string, Required): Unique identifier of target group.
 *   - avatarFile (File | null, Required): New avatar File object to upload, or null if removing.
 *   - originalPath (string | null, Required): Old avatar file path to delete from storage.
 */

import { createClient } from '@/app/utils/supabase/client'

/**
 * BEHAVIORAL MECHANISM:
 * If avatarFile is provided, uploads file to storage bucket 'attachments', removes existing file at originalPath,
 * and updates poster_path in table 'groups'. If avatarFile is null, deletes originalPath file and sets poster_path to null.
 *
 * PARAMETERS:
 * - { groupId, avatarFile, originalPath }: Parameters for group ID, file payload, and old storage path.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing database update result or error message.
 */
export async function updateGroupPosterPath({ groupId, avatarFile, originalPath }: { groupId: string, avatarFile: File | null, originalPath: string | null }) {
    const supabase = createClient();
    let avatarUrlPath = null
    if (avatarFile != null) {
        avatarUrlPath = `${groupId}/${Date.now()}-${avatarFile.name}`;

        const { error: storageError } = await supabase.storage.from('attachments').upload(avatarUrlPath, avatarFile);
        if (storageError) {
            return { error: "Failed to upload the group image" }
        }

        if (originalPath != null || originalPath != "") {
            const { error: storageError } = await supabase.storage.from('attachments').remove([originalPath!]);
        }

        const { data, error } = await supabase.from('groups').update({ poster_path: avatarUrlPath }).eq('id', groupId)
        if (error) {
            return { error: "Fail to update the group image" }
        }
        return { data, error }
    }

    if (originalPath != null || originalPath != "") {
        const { error: storageError } = await supabase.storage.from('attachments').remove([originalPath!]);
    }
    const { data, error } = await supabase.from('groups').update({ poster_path: null }).eq('id', groupId)
    if (error) {
        return { error: "Fail to delete the group image" }
    }
    return { data, error }
}
