import { NextResponse, type NextRequest } from 'next/server'
import { type SupabaseClient, type User } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { PROFILE_ROLE } from '../types/enum'

export async function submissionGradingRoute({
    request,
    user,
    supabase,
}: {
    request: NextRequest
    user: User | null
    supabase: SupabaseClient<Database>
}) {
    const pathname = request.nextUrl.pathname
    const pathnameSplitted = pathname.split('/')

    if (
        pathname.startsWith('/submission/grading') &&
        pathnameSplitted.length === 4
    ) {
        if (user == null) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        const { data: userRole, error: userRoleError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        if (userRoleError) {
            const url = request.nextUrl.clone()
            url.pathname = '/events'
            return NextResponse.redirect(url)
        }

        if (userRole?.role == PROFILE_ROLE.STUDENT) {
            const url = request.nextUrl.clone()
            url.pathname = '/groups'
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next({ request })
}