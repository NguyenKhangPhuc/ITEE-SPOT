'use server'
import { EventCriteriaInsert } from "../types/event_criteria";
import { SubmissionInsert } from "../types/submission";
import { createClient } from "../utils/supabase/server";

export async function updateEventCriteria({ updatedCriteria }: { updatedCriteria: EventCriteriaInsert }) {
    const supabase = await createClient();

    const { data, error } = await supabase.from('event_grading_criteria').update(updatedCriteria).eq('id', updatedCriteria.id ?? "")

    if (error) {
        return { error: "Fail to update the criteria" }
    }

    return { data, error }
}


export async function createEventCriteria({ newCriteria, eventId }: { newCriteria: EventCriteriaInsert, eventId: string }) {
    const supabase = await createClient();
    newCriteria.event_id = eventId
    newCriteria.id = undefined
    if (eventId.length == 0 || !eventId) {
        return { error: "Fail to create the criteria 2" }
    }
    const { data, error } = await supabase.from('event_grading_criteria').insert(newCriteria).select("*").maybeSingle()
    if (error) {
        console.log(error)
        return { error: "Fail to create the criteria" }
    }

    return { data, error }
}

export async function getEventCriteriaById(eventId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('event_grading_criteria').select('*').eq('event_id', eventId)
        .order('id', { ascending: false });
    return { data, error }
}