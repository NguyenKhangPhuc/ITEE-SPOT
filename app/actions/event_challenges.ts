'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { EventChallengeInsert } from '../types/event_challenges';



export async function getEventChallenges(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from("event_challenges").select("*").eq("event_id", id);

    return { data, error }
}

export async function createEventChallenge(eventChallenge: EventChallengeInsert) {
    const supabase = await createClient()

    const { data, error } = await supabase.from('event_challenges').insert(eventChallenge).select('*').maybeSingle()

    if (error) {
        return { error: "Fail to create the challenge" }
    }

    return { data, error }
}