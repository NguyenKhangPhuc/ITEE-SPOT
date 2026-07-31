'use server'

/**
 * PURPOSE:
 * Creates or updates a student group project submission, synchronizes selected project awards, and handles project file uploads and deletions in storage.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from app/actions/projects.ts as part of decomposing server actions into per-file HTTP intent structure.
 *
 * INPUTS / PARAMETERS:
 * - params (Object, Required): Object containing project details, submitted files array, and selected project awards array.
 *   - project (ProjectsInsert, Required): Base project record object to insert or update.
 *   - submittedFiles (Array<SubmissionFileExtended>, Required): List of project attachments (new files or existing ones).
 *   - projectAwards (Array<ProjectAwardsInsert>, Required): List of selected award IDs to associate with the project.
 */

import { createClient } from '@/app/utils/supabase/server'
import { PROJECT_STATUS } from '@/app/types/enum'
import { ProjectAwardsInsert } from '@/app/types/project_awards'
import { ProjectsInsert } from '@/app/types/projects'
import { SubmissionFileExtended } from '@/app/types/submission_files'

/**
 * BEHAVIORAL MECHANISM:
 * Upserts project record in 'projects' matching group_id and group_challenge_id, sets status to PENDING, deletes and inserts
 * project awards in 'project_awards', uploads new files to storage 'attachments' bucket and inserts 'project_files',
 * and removes deleted files from storage and 'project_files' table.
 *
 * PARAMETERS:
 * - { project, submittedFiles, projectAwards }: Form payload objects for project details, attachments, and award selections.
 *
 * RETURN VALUE:
 * - Promise<{ data?: any, error?: string | any }>: Object containing upserted project record payload or error message string.
 */
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
        return { error: "Fail to update the project submission" }
    };
    if (!subData) {
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
                return
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
