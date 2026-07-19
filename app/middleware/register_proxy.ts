import { NextResponse, type NextRequest } from 'next/server'
import { type SupabaseClient, type User } from '@supabase/supabase-js'
import { Database } from '../types/database.types'

export async function registerRoute({
    request,
    user,
    supabase,
}: {
    request: NextRequest
    user: User | null
    supabase: SupabaseClient<Database>
}) {
    const pathname = request.nextUrl.pathname

    if (pathname.startsWith('/register/') && pathname.split('/').length === 3) {
        if (user == null) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        const id = pathname.split('/')[2]

        // Check if event registration_status has ended or is locked.
        const { data: eventData } = await supabase
            .from('events')
            .select('registration_status')
            .eq('id', id)
            .maybeSingle()

        if (!eventData || eventData.registration_status !== 'ongoing') {
            const url = request.nextUrl.clone()
            url.pathname = '/events'
            return NextResponse.redirect(url)
        }

        const { data, error } = await supabase
            .from('group_members')
            .select('member_id,group_id, groups!inner(event_id)')
            .eq('member_id', user.id)
            .eq('groups.event_id', id)
            .maybeSingle()

        if (error) {
            const url = request.nextUrl.clone()
            url.pathname = '/groups'
            return NextResponse.redirect(url)
        }

        if (data != null) {
            const url = request.nextUrl.clone()
            url.pathname = `/groups/${data.group_id}`
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next({ request })
}