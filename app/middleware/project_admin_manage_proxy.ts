import { NextResponse, type NextRequest } from 'next/server'
import { type SupabaseClient, type User } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { PROFILE_ROLE, PROJECT_STATUS } from '../types/enum'

export async function projectsManageRoute({
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

    if (pathname.startsWith('/projects') && pathnameSplitted.length == 3) {
        const specificRoute = pathnameSplitted[2]

        if (specificRoute == 'admins') {
            const { data: userRole, error: userRoleError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user!.id)
                .maybeSingle()

            if (userRoleError || userRole?.role != PROFILE_ROLE.ADMIN) {
                const url = request.nextUrl.clone()
                url.pathname = '/'
                return NextResponse.redirect(url)
            }
        } else if (specificRoute != 'students') {
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('id,project_status')
                .eq('id', specificRoute)
                .maybeSingle()

            if (projectError) {
                const url = request.nextUrl.clone()
                url.pathname = '/projects'
                return NextResponse.redirect(url)
            }

            if (!projectData || projectData.project_status != PROJECT_STATUS.ACCEPTED) {
                const url = request.nextUrl.clone()
                url.pathname = '/projects'
                return NextResponse.redirect(url)
            }
        }
    }

    return NextResponse.next({ request })
}