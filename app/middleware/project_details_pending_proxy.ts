import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '../types/database.types'
import { PROFILE_ROLE, PROJECT_STATUS } from '../types/enum'
import { User } from '@supabase/supabase-js'

export async function projectDetailsPendingRoute({ request, user }: { request: NextRequest, user: User | null }) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // With Fluid compute, don't put this client in a global environment
    // variable. Always create a new one on each request.
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
                },
            },
        }
    )
    const pathname = request.nextUrl.pathname;
    const pathnameSplitted = pathname.split('/')
    if (
        pathname.startsWith('/projects') && pathnameSplitted.length == 4 && pathnameSplitted[3] == 'pending'
    ) {
        if (user == null) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        const projectId = pathnameSplitted[2]
        if (user == null) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
        }
        const { data: projectData, error: projectError } = await supabase.from('projects').select('id,project_status,group_id').eq('id', projectId).maybeSingle();

        if (projectError) {
            const url = request.nextUrl.clone()
            url.pathname = '/projects'
            return NextResponse.redirect(url)
        }

        const { data: role, error: roleError } = await supabase.from('profiles').select('role, id').eq('id', user.id).maybeSingle();

        if (!role || roleError) {
            const url = request.nextUrl.clone()
            url.pathname = '/projects'
            return NextResponse.redirect(url)
        }

        if (role.role != PROFILE_ROLE.ADMIN) {
            const { data: groupMember, error: groupMemberError } = await supabase
                .from('group_members')
                .select('*')
                .eq('group_id', projectData?.group_id ?? "")
                .eq('member_id', user?.id ?? "")
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

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}