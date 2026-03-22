'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { LoginForm, SignupForm } from '../types/form_data'

export async function login(formData: LoginForm) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.email,
        password: formData.password,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.log(error)
        throw new Error(error.code)
    }

    redirect('/')
}

export async function signup(formData: SignupForm, origin: string) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs


    const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName, email: formData.email }, emailRedirectTo: `${origin}/auth/callback`, }
    })

    if (error) {
        console.log(error)
        throw new Error(error.message)
    }

    redirect('/')
}

export async function signout() {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const { error } = await supabase.auth.signOut()

    if (error) {
        console.log(error)
        throw new Error(error.message)
    }
    redirect('/login')
}

export async function getUser() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser()

    return { data, error }
}

export async function resendVerificationCode(email: string, origin: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
            emailRedirectTo: `${origin}/auth/callback`
        }
    })

    if (error) {
        throw new Error(error.message)
    }

    return data
}