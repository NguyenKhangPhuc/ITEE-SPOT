'use client'

/**
 * PURPOSE:
 * Creates or updates a group challenge submission, manages fun facts entries, and handles submission file uploads and storage removals.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/submissions.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing submission details, submitted files array, and funfacts list.
 *   - submission (SubmissionInsert, Required): Object holding group_id, group_challenge_id, title, description, links.
 *   - submittedFiles (Array<SubmissionFileExtended>, Required): List of submission attachments.
 *   - funfacts (Array<FunFactsInsert>, Required): List of fun facts entries to associate with submission.
 */

import { createClient } from '@/app/utils/supabase/client'
import { FunFactsInsert } from '@/app/types/funfacts'
import { SubmissionInsert } from '@/app/types/submission'
import { SubmissionFileExtended } from '@/app/types/submission_files'

/**
 * BEHAVIORAL MECHANISM:
 * Upserts submission row in 'submissions' matching group_id and group_challenge_id, deletes and re-inserts fun facts
 * in 'fun_facts', uploads new files to storage bucket 'attachments' and inserts 'submission_files', and removes deleted files.
 *
 * PARAMETERS:
 * - { submission, submittedFiles, funfacts }: Parameters for submission fields, attachments array, and fun facts list.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing upserted submission record payload or error message string.
 */
export async function saveGroupChallengeSubmission({ submission, submittedFiles, funfacts }:
    { submission: SubmissionInsert, submittedFiles: Array<SubmissionFileExtended>, funfacts: Array<FunFactsInsert> }) {
    const supabase = createClient()
    const { data: subData, error: subError } = await supabase
        .from('submissions')
        .upsert({
            title: submission.title,
            github_link: submission.github_link,
            youtube_link: submission.youtube_link,
            short_description: submission.short_description,
            description: submission.description,
            group_id: submission.group_id,
            group_challenge_id: submission.group_challenge_id,
        }, { onConflict: 'group_id,group_challenge_id' })
        .select('id')
        .maybeSingle()

    if (subError) {
        return { error: "Fail to update the submission" }
    };
    if (!subData) {
        return { error: "Fail to update the submission" }
    };

    const { data: deletedFunFacts, error: funfactsError } = await supabase.from('fun_facts').delete().eq('submission_id', subData.id)
    if (funfactsError) {
        return { error: "Fail to update the fun_facts" }
    }
    const updatedFunFacts = funfacts.map(funfact => ({
        submission_id: subData.id,
        fact: funfact.fact
    }));
    const { data: insertedFunFacts, error: insertedError } = await supabase.from('fun_facts').upsert(updatedFunFacts)
    if (insertedError) {

        return { error: "Error inserting new funfacts" }
    }
    const newFiles = submittedFiles.filter(f => !f.id);
    const existingFileIds = submittedFiles.filter(f => f.id).map(f => f.id);

    const { data: oldFiles } = await supabase.from('submission_files').select('*').eq('submission_id', subData.id);

    const deletedFiles = oldFiles?.filter(old => !existingFileIds.includes(old.id)) ?? [];
    const deletedFilesId = deletedFiles.map((ele) => ele.id)
    const deleteFilesStorage = deletedFiles.map((ele) => ele.storage_path ?? "")
    if (deletedFiles.length > 0) {
        const { error: dbError } = await supabase
            .from('submission_files')
            .delete()
            .in('id', deletedFilesId);

        if (dbError) {
            return { error: "Failed to delete the submission files" }
        }
        const { error: storageError } = await supabase.storage
            .from('attachments')
            .remove(deleteFilesStorage);
    }

    if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (item) => {
            const file = item.file!;
            const filePath = `${submission.group_id}/${Date.now()}-${file.name}`;

            const { error: storageError } = await supabase.storage.from('attachments').upload(filePath, file);
            if (storageError) {
                return
            };

            return {
                submission_id: subData.id,
                group_id: submission.group_id,
                storage_path: filePath,
                original_file_name: file.name,
                size: file.size,
                mime_type: file.type,
            };
        });

        const recordsToInsert = (await Promise.all(uploadPromises)).filter((r): r is NonNullable<typeof r> => r != null);
        const { data: insertedFile, error: insertedFileEror } = await supabase.from('submission_files').insert(recordsToInsert);
        if (insertedFileEror) {
            console.error(insertedFileEror)
            return { error: "Fail to insert files" }
        }
    }

    return { data: subData, error: null };
}
