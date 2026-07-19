import { NextResponse, type NextRequest } from 'next/server'
import { type SupabaseClient, type User } from '@supabase/supabase-js'
import { Database } from '../types/database.types'

export async function userGroupRoute({
    request,
    user,
    supabase,
}: {
    request: NextRequest
    user: User | null
    supabase: SupabaseClient<Database>
}) {
    const pathname = request.nextUrl.pathname

    if (pathname.startsWith('/groups/') && pathname.split('/').length === 3) {
        if (user == null) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        const groupId = pathname.split('/')[2]

        const { data, error } = await supabase
            .from('group_members')
            .select('*')
            .eq('member_id', user.id)
            .eq('group_id', groupId)
            .maybeSingle()

        if (error || data == null) {
            const url = request.nextUrl.clone()
            url.pathname = '/groups'
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next({ request })
}