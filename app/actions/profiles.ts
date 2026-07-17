'use server'

import { PROFILE_ROLE } from "../types/enum";
import { ResetPasswordForm, VerifyAccountForm } from "../types/form_data";
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
        return { error: 'Fail to update the profile' }
    }
    return { data, error }
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
        return { error: 'Fail to verify the OTP' }
    }

    if (data.session == null) {
        return { error: 'Fail to update the user password' }
    }
    const { error: userError } = await supabase.auth.updateUser({ password: resetPasswordData.newPassword })
    if (userError) {
        return { error: 'Fail to update the user password' }
    }
    await supabase.auth.signOut({ scope: 'global' });

    return { error: null }
}

export async function verifySignUpAccount(verifyAccount: VerifyAccountForm) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.verifyOtp(
        {
            email: verifyAccount.email,
            token: verifyAccount.otp,
            type: 'signup'
        }
    )
    if (error) {
        return { error: 'Fail to verify the OTP' }
    }
    if (data.session == null) {
        return { error: 'Fail to verify the OTP' }
    }
    return { data, error }
}

export async function updateProfileAvatar({ userId, posterFile, originalPath }: { userId: string, posterFile: File | null, originalPath: string | null }) {
    const supabase = await createClient();
    let posterPath = null
    if (posterFile != null) {
        posterPath = `${userId}/${Date.now()}-${posterFile.name}`;

        if (originalPath) {
            const { error } = await supabase.storage.from('attachments').remove([originalPath])
        }
        const { error: storageError } = await supabase.storage.from('attachments').upload(posterPath, posterFile);
        if (storageError) {
            return { error: "Failed to upload to storage" }
        }

        const { error } = await supabase.from('profiles').update({ avatar_url: posterPath }).eq('id', userId)
        if (error) {
            return { error: "Failed to update image, please contact staff" }
        }
        return { error: null }
    }

    if (originalPath) {
        const { error } = await supabase.storage.from('attachments').remove([originalPath])
    }
    const { error } = await supabase.from('profiles').update({ avatar_url: null }).eq('id', userId)
    if (error) {
        return { error: "Failed to update image, please contact staff" }
    }
    return { error }
}

export async function getAllUsers() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) {
        return { error: 'Fail to fetch all user information' }
    }

    return { data, error }
}

export async function updateUserRoleByUserId(userId: string, role: PROFILE_ROLE) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').update({ role: role }).eq('id', userId)
    console.log(error)
    if (error){
        return {error: 'Fail to update user profile'}
    }
    return {data, error}
}