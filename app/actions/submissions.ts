'use server'
import { randomUUID } from "crypto";
import { FunFactsInsert } from "../types/funfacts";
import { SubmissionInsert } from "../types/submission";
import { SubmissionFileExtended, SubmissionFileInsert } from "../types/submission_files";
import { createClient } from "../utils/supabase/server";

export async function getGoupChallengeSubmission({ groupId, groupChallengeId }: { groupId: string, groupChallengeId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('submissions')
        .select('*, submission_files (*), submission_reactions (*), submission_ratings (*), fun_facts (*)')
        .eq('group_id', groupId)
        .eq('group_challenge_id', groupChallengeId)
        .maybeSingle()

    if (error) {
        return { error: "Fail to get group's submissions" }
    }
    return { data, error }
}


export async function getSubmissionByGroupId({ groupId }: { groupId: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('submissions')
        .select('*, group_challenge (id, event_challenges (company_name, title)), submission_files (*), submission_reactions (*), submission_ratings (*), fun_facts (*)')
        .eq('group_id', groupId)
    return { data, error }
}


export async function saveGroupChallengeSubmission({ submission, submittedFiles, funfacts }:
    { submission: SubmissionInsert, submittedFiles: Array<SubmissionFileExtended>, funfacts: Array<FunFactsInsert> }) {
    const supabase = await createClient()
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
                return { error: "Fail to upload files to storage" }
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

        const recordsToInsert = await Promise.all(uploadPromises);
        const { data: insertedFile, error: insertedFileEror } = await supabase.from('submission_files').insert(recordsToInsert);
        if (insertedFileEror) {
            console.error(insertedFileEror)
            return { error: "Fail to insert files" }
        }
    }

    return { data: subData, error: null };
}

export async function getSubmissionById(submissionId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('submissions')
        .select('*, groups (event_id)').eq('id', submissionId).maybeSingle()
    // console.log(data)
    return { data, error }

}


export async function getSubmissionWithGrade({ eventId, userId }: { eventId: string, userId: string }) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('submission_final_scores')
        .select('*, submissions!inner (*, groups!inner (id,group_name, event_id), submission_grading (*, event_grading_criteria (percentage, type)))')
        .order('type', { referencedTable: 'submissions.submission_grading.event_grading_criteria', ascending: true })
        .order('event_criteria_id', { referencedTable: 'submissions.submission_grading', ascending: false })
        .order('final_average_score', { ascending: false })
        .eq('submissions.groups.event_id', eventId)
        .eq('submissions.submission_grading.user_id', userId)
    if (error) {
        return { error: "Fail to fetch all submission grade" }
    }
    return { data, error }
}

export async function getTop5SubmissionGrade({ eventId, userId }: { eventId: string, userId: string }) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('submission_final_scores')
        .select('*, submissions!inner (*, groups!inner (id,group_name, event_id), submission_grading (*, event_grading_criteria (percentage, type)))')
        .order('type', { referencedTable: 'submissions.submission_grading.event_grading_criteria', ascending: true })
        .order('event_criteria_id', { referencedTable: 'submissions.submission_grading', ascending: false })
        .order('final_average_score', { ascending: false })
        .limit(5)
        .eq('submissions.groups.event_id', eventId)
        .eq('submissions.submission_grading.user_id', userId)
    if (error) {
        return { error: "Fail to fetch top 3 submission grade" }
    }
    return { data, error }
}

export async function getSubmissionGradeBasedOnStar({ eventId, rating, userId }: { eventId: string, rating: number, userId: string }) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('submission_final_scores')
        .select('*, submissions!inner (*, groups!inner (id,group_name, event_id), submission_grading (*, event_grading_criteria (percentage, type)), submission_ratings!inner (id, rating))')
        .order('type', { referencedTable: 'submissions.submission_grading.event_grading_criteria', ascending: true })
        .order('event_criteria_id', { referencedTable: 'submissions.submission_grading', ascending: false })
        .order('final_average_score', { ascending: false })
        .eq('submissions.submission_ratings.rating', rating)
        .eq('submissions.submission_ratings.user_id', userId)
        .eq('submissions.groups.event_id', eventId)
        .eq('submissions.submission_grading.user_id', userId)
    if (error) {
        return { error: "Fail to fetch 5 stare submission grade" }
    }


    return { data, error }
}

