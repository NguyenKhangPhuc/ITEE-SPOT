'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { Event, EventInsert } from '../types/event'
import { title } from 'process'
import { EVENT_STATUS } from '../types/enum'
import { PostgrestError } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';
import { EventChallengeInsert } from '../types/event_challenges'

export async function createEvent({ event, challenges, avatarFile }: { event: EventInsert, challenges: Array<EventInsert>, avatarFile: File | null }) {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser()
    const eventId: string = uuidv4()
    let avatarUrlPath = null
    if (avatarFile != null) {
        avatarUrlPath = `${eventId}/${Date.now()}-${avatarFile.name}`;
        if (avatarUrlPath) {
            const { error: storageError } = await supabase.storage.from('attachments').upload(avatarUrlPath, avatarFile);
            if (storageError) {
                return { error: "Failed to upload to storage" }
            }
        }
    }
    const { data, error }: { data: Event | null, error: PostgrestError | null } = await supabase.from("events").insert(
        {
            id: eventId,
            title: event.title,
            poster_path: avatarUrlPath,
            short_description: event.short_description,
            content: event.content,
            location: event.location,
            max_group_members: event.max_group_members,
            start_date: event.start_date,
            end_date: event.end_date,
            organized_date: event.organized_date,
            status: EVENT_STATUS.ONGOING,
            owner_id: user.user?.id
        },
    ).select().single()

    if (error) {
        console.log(error)
        return { error: "Fail to create the event, please contact staffs" }
    }


    const updatedChallenges = challenges.map(challenge => ({
        ...challenge,
        event_id: data?.id
    }));

    const { error: challengeError } = await supabase.from("event_challenges").insert(updatedChallenges)

    if (challengeError) {
        return { error: "Fail to create the event challenges, please contact staffs" }
    }

    revalidatePath('/events');
    return { data, error: null }
}

export async function getAllEvents() {
    const supabase = await createClient();

    const { data, error } = await supabase.from("events").select("*");

    return { data, error }
}

export async function getSingleEvent(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from("events").select("*, event_challenges (*)").eq("id", id).single();

    return { data, error }
}

export async function updateEventPoster({ eventId, posterFile, originalPath }: { eventId: string, posterFile: File | null, originalPath: string | null }) {
    const supabase = await createClient();
    let posterPath = null
    if (posterFile != null) {
        posterPath = `${eventId}/${Date.now()}-${posterFile.name}`;

        if (originalPath) {
            const { error } = await supabase.storage.from('attachments').remove([originalPath])
        }
        const { error: storageError } = await supabase.storage.from('attachments').upload(posterPath, posterFile);
        if (storageError) {
            return { error: "Failed to upload to storage" }
        }

        const { error } = await supabase.from('events').update({ poster_path: posterPath }).eq('id', eventId)
        if (error) {
            return { error: "Failed to update image, please contact staff" }
        }
        return { error: null }
    }

    if (originalPath) {
        const { error } = await supabase.storage.from('attachments').remove([originalPath])
    }
    const { error } = await supabase.from('events').update({ poster_path: null }).eq('id', eventId)
    if (error) {
        return { error: "Failed to update image, please contact staff" }
    }
    return { error }
}

export async function updateEventChallenges({ eventChallenge }: { eventChallenge: EventChallengeInsert }) {
    const supabase = await createClient()
    console.log(eventChallenge)
    const { data, error } = await supabase
        .from('event_challenges')
        .update({ title: eventChallenge.title, company_name: eventChallenge.company_name })
        .eq('id', eventChallenge.id!)
        .select()
    console.log(error, data)
    if (error) {
        return { error: 'Failed to update challenge information' };
    }
    return { data, error }
}

export async function updateEventInfo({ event }: { event: EventInsert }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('events').update({
        title: event.title,
        start_date: event.start_date,
        end_date: event.end_date,
        short_description: event.short_description,
        content: event.content,
        max_group_members: event.max_group_members,
        organized_date: event.organized_date,
        location: event.location
    }).eq('id', event.id!)

    if (error) {
        console.log(error, event)
        return { error: "Fail to update event information" }
    }
    return { data, error }
}
