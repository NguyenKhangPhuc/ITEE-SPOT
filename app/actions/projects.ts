'use server'

import { PAGE_SIZE, PAGE_SIZE_PROJECT } from "../constants";
import page from "../page";
import { PROJECT_STATUS } from "../types/enum";
import { FunFactsInsert } from "../types/funfacts";
import { ProjectAwardsInsert } from "../types/project_awards";
import { ProjectsInsert } from "../types/projects";
import { SubmissionFileExtended } from "../types/submission_files";
import { createClient } from "../utils/supabase/server";

export async function getAllProject({ page = 1 }: { page: number }) {
    const supabase = await createClient()
    const from = (page - 1) * PAGE_SIZE_PROJECT
    const to = from + PAGE_SIZE_PROJECT - 1

    const { data, error, count } = await supabase
        .from('projects')
        .select('id, group_id, project_awards(*, event_awards(*)), groups (group_name, short_description, event_id, events (*))', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)
        .eq('project_status', PROJECT_STATUS.ACCEPTED)

    if (error) {
        return { error: "Fail to load the projects" }
    }

    const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE_PROJECT)
    return { data, totalPages, error: null }
}

export async function getSingleProject({ projectId }: { projectId: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*, groups (group_name, group_members(id, profiles(*)), events(*)), project_awards(*, event_awards(*))')
        .eq('id', projectId)
        .single();

    if (error) {
        return { error: 'Failed to fetch the project' }
    }

    return { data, error }
}

export async function saveStudentGroupProject({ project, submittedFiles, projectAwards }:
    { project: ProjectsInsert, submittedFiles: Array<SubmissionFileExtended>, projectAwards: Array<ProjectAwardsInsert> }) {
    const supabase = await createClient()
    const { data: subData, error: subError } = await supabase
        .from('projects')
        .upsert({
            project_title: project.project_title,
            github_link: project.github_link,
            youtube_link: project.youtube_link,
            short_description: project.short_description,
            description: project.description,
            group_id: project.group_id,
            group_challenge_id: project.group_challenge_id,
            project_status: PROJECT_STATUS.PENDING
        }, { onConflict: 'group_id,group_challenge_id' })
        .select('id')
        .maybeSingle()

    if (subError) {
        console.log(subError)
        return { error: "Fail to update the project submission" }
    };
    if (!subData) {
        console.log(subData + " This is the error")
        return { error: "Fail to update the project submission" }
    };

    const updatedProjectsAward: Array<ProjectAwardsInsert> = projectAwards.map((ele) => {
        return {
            project_id: subData.id,
            award_id: ele.award_id
        }
    })

    if (projectAwards.length != 0) {
        const { data: deletedProjectsAwards, error: deletedProjectAwardsError } = await supabase.from('project_awards').delete().eq('project_id', subData.id)
        if (deletedProjectAwardsError) {
            return { error: "Fail to update the project" }
        }
    }

    const { data: insertedProjectAwards, error: projectAwardsError } = await supabase.from('project_awards').insert(updatedProjectsAward)
    if (projectAwardsError) {
        return { error: "Fail to update the project" }
    }

    const newFiles = submittedFiles.filter(f => !f.id);
    const existingFileIds = submittedFiles.filter(f => f.id).map(f => f.id);

    const { data: oldFiles } = await supabase.from('project_files').select('*').eq('project_id', subData.id);

    const deletedFiles = oldFiles?.filter(old => !existingFileIds.includes(old.id)) ?? [];
    const deletedFilesId = deletedFiles.map((ele) => ele.id)
    const deleteFilesStorage = deletedFiles.map((ele) => ele.storage_path ?? "")

    if (deletedFiles.length > 0) {
        const { error: dbError } = await supabase
            .from('project_files')
            .delete()
            .in('id', deletedFilesId);

        if (dbError) {
            return { error: "Failed to delete the project files" }
        }
        const { error: storageError } = await supabase.storage
            .from('attachments')
            .remove(deleteFilesStorage);
    }


    if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (item) => {
            const file = item.file!;
            const filePath = `${project.group_id}/${Date.now()}-${file.name}`;

            const { error: storageError } = await supabase.storage.from('attachments').upload(filePath, file);
            if (storageError) {
                return { error: "Fail to upload files to storage" }
            };

            return {
                project_id: subData.id,
                group_id: project.group_id,
                storage_path: filePath,
                original_file_name: file.name,
                size: file.size,
                mime_type: file.type,
            };
        });

        const recordsToInsert = await Promise.all(uploadPromises);
        const { data: insertedFile, error: insertedFileEror } = await supabase.from('project_files').insert(recordsToInsert);
        if (insertedFileEror) {
            console.error(insertedFileEror)
            return { error: "Fail to insert files" }
        }
    }

    return { data: subData, error: null };
}



export async function getSingleProjectByGroupAndChallenge({ group_id, group_challenge_id }: { group_id: string, group_challenge_id: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('projects')
        .select('*, project_awards(*), project_files(*)')
        .eq('group_id', group_id)
        .eq('group_challenge_id', group_challenge_id)
        .maybeSingle()

    if (error) {
        console.log(error)
        return { error: "Failed to fetch the information" }
    }

    return { data, error }
}