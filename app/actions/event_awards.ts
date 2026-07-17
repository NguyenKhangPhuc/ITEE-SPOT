'use server'

import { EventAwardsInsert } from "../types/event_awards";
import { createClient } from "../utils/supabase/server";

export async function updateEventAward(award: EventAwardsInsert) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('event_awards').update(award).eq('id', award.id ?? "").select('*').maybeSingle()
    if (error) {
        return { error: 'Fail to update the award' }
    }
    return { data, error }
}

export async function createEventAwarđ(award: EventAwardsInsert) {
    const supabase = await createClient()
    award.id = undefined
    const { data, error } = await supabase.from('event_awards').insert(award).select('*').maybeSingle()
    if (error) {
        return { error: 'Fail to insert new award' }
    }
    return { data, error }
}

export async function getAwardsByEventId(eventId: string){
    const supabase = await createClient()
    const {data, error} = await supabase.from('event_awards').select('*').eq('event_id', eventId)
    if (error){
        return {error: 'Failed to fetch the awards'}
    }
    return {data, error}
}