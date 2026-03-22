'use server'

import { ResetPasswordForm } from "../types/form_data";
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

export async function resetPassword(resetPasswordData: ResetPasswordForm) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp(
        {
            email: resetPasswordData.email,
            token: resetPasswordData.otp,
            type: 'email'
        }
    )
    if (error) {
        throw new Error(error.message)
    }

    if (data.session == null) {
        throw new Error('Error occur when updating user password')
    }
    const { error: userError } = await supabase.auth.updateUser({ password: resetPasswordData.newPassword })
    if (userError) {
        throw new Error(userError.message)
    }
    await supabase.auth.signOut({ scope: 'global' });

    return
}