'use server'

import { PAGE_SIZE, PAGE_SIZE_PROJECT } from "../constants";
import page from "../page";
import { PROJECT_STATUS } from "../types/enum";
import { createClient } from "../utils/supabase/server";

export async function getAllProject({ page = 1 }: { page: number }) {
    const supabase = await createClient()
    const from = (page - 1) * PAGE_SIZE_PROJECT
    const to = from + PAGE_SIZE_PROJECT - 1

    const { data, error, count } = await supabase
        .from('projects')
        .select('id, group_id, award_id, event_awards(*), groups (group_name, short_description, event_id, events (*))', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)
        .eq('project_status', PROJECT_STATUS.ACCEPTED)

    if (error) {
        return { error: "Fail to load the projects" }
    }

    const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE_PROJECT)
    return { data, totalPages, error: null }
}

