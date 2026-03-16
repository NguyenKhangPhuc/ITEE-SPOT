'use server'
import { SubmissionInsert } from "../types/submission";
import { SubmissionFileExtended, SubmissionFileInsert } from "../types/submission_files";
import { createClient } from "../utils/supabase/server";

export async function getGoupChallengeSubmission({ groupId, groupChallengeId }: { groupId: string, groupChallengeId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('submissions')
        .select('*, submission_files (*), submission_reactions (*), submission_ratings (*)')
        .eq('group_id', groupId)
        .eq('group_challenge_id', groupChallengeId)
        .maybeSingle()

    if (error) {
        throw new Error(error.message)
    }
    return data
}


export async function getSubmissionByGroupId({ groupId }: { groupId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('submissions')
        .select('*, group_challenge (id, event_challenges (company_name, title)), submission_files (*), submission_reactions (*), submission_ratings (*)')
        .eq('group_id', groupId)

    return { data, error }
}


export async function saveGroupChallengeSubmission({ submission, submittedFiles }: { submission: SubmissionInsert, submittedFiles: Array<SubmissionFileExtended> }) {
    const supabase = await createClient()

    const { data: subData, error: subError } = await supabase
        .from('submissions')
        .upsert({
            github_link: submission.github_link,
            youtube_link: submission.youtube_link,
            short_description: submission.short_description,
            description: submission.description,
            group_id: submission.group_id,
            group_challenge_id: submission.group_challenge_id,
        }, { onConflict: 'group_id,group_challenge_id' })
        .select()
        .maybeSingle()

    if (subError) throw new Error(`Sub Error: ${subError.message}`);
    if (!subData) throw new Error("No submission data returned");

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
            throw new Error(`${dbError.message}`);
        }
        const { error: storageError } = await supabase.storage
            .from('attachments')
            .remove(deleteFilesStorage);

        if (storageError) {
            console.error(storageError.message);
        }
    }

    // 4. Upload file mới
    if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (item) => {
            const file = item.file!;
            const filePath = `${submission.group_id}/${Date.now()}-${file.name}`;

            const { error: storageError } = await supabase.storage.from('attachments').upload(filePath, file);
            if (storageError) throw storageError;

            return {
                submission_id: subData.id,
                group_id: submission.group_id,
                storage_path: filePath,
                original_file_name: file.name,
                size: file.size,
                mime_type: file.type,
            };
        });

        const recordsToInsert = await Promise.all(uploadPromises);
        console.log(recordsToInsert)
        const { data: insertedFile, error: insertedFileEror } = await supabase.from('submission_files').insert(recordsToInsert);
        if (insertedFileEror) {
            console.error(insertedFileEror)
            throw new Error(insertedFileEror.message)
        }
    }

    return subData;
}