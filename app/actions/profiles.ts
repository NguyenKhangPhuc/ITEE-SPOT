'use server'

import { ProfileInsert } from "../types/profile";
import { createClient } from "../utils/supabase/server";

export async function getUserProfile(userId: string) {
    const supabase = await createClient()

    const { data: userProfile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()

    return { data: userProfile, error: profileError }
}

export async function updateProfile({ profile }: { profile: ProfileInsert }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').update(profile).eq('id', profile.id!).select().maybeSingle();
    if (error) {
        throw new Error(error.message)
    }
    return data
}