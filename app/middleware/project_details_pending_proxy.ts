import { NextResponse, type NextRequest } from 'next/server'
import { type SupabaseClient, type User } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { PROFILE_ROLE, PROJECT_STATUS } from '../types/enum'

export async function projectDetailsPendingRoute({
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
        pathname.startsWith('/projects') &&
        pathnameSplitted.length == 4 &&
        pathnameSplitted[3] == 'pending'
    ) {
        // Single null guard — the duplicate dead-code check has been removed.
        if (user == null) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        const projectId = pathnameSplitted[2]

        const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('id,project_status,group_id')
            .eq('id', projectId)
            .maybeSingle()

        if (projectError) {
            const url = request.nextUrl.clone()
            url.pathname = '/projects'
            return NextResponse.redirect(url)
        }

        const { data: role, error: roleError } = await supabase
            .from('profiles')
            .select('role, id')
            .eq('id', user.id)
            .maybeSingle()

        if (!role || roleError) {
            const url = request.nextUrl.clone()
            url.pathname = '/projects'
            return NextResponse.redirect(url)
        }

        if (role.role != PROFILE_ROLE.ADMIN) {
            const { data: groupMember, error: groupMemberError } = await supabase
                .from('group_members')
                .select('*')
                .eq('group_id', projectData?.group_id ?? '')
                .eq('member_id', user?.id ?? '')
                .maybeSingle()

            if (groupMemberError || !groupMember) {
                const url = request.nextUrl.clone()
                url.pathname = '/projects'
                return NextResponse.redirect(url)
            }

            if (!projectData || projectData.project_status == PROJECT_STATUS.ACCEPTED) {
                const url = request.nextUrl.clone()
                url.pathname = '/projects'
                return NextResponse.redirect(url)
            }
        }
    }

    return NextResponse.next({ request })
}