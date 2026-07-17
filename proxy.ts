import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "./app/utils/supabase/proxy"
import { registerRoute } from "./app/middleware/register_proxy"
import { submissionRoute } from "./app/middleware/submission_proxy"
import { createEventRoute } from "./app/middleware/create_event_proxy"
import { viewAllGroups } from "./app/middleware/view_all_groups"
import { userGroupRoute } from "./app/middleware/user_group"
import { submissionReadOnlyRoute } from "./app/middleware/submission_read_only"
import { editEventRoute } from "./app/middleware/edit_event_proxy"
import { submissionGradingRoute } from "./app/middleware/submission_grading"
import { Database } from "./app/types/database.types"
import { createServerClient } from "@supabase/ssr"
import { eventSubmissionGradingRoute } from "./app/middleware/submission_evaluation_all"
import { maintenanceModeCheck } from "./app/middleware/maintenance"
import { projectsManageRoute } from "./app/middleware/project_admin_manage_proxy"
import { projectDetailsPendingRoute } from "./app/middleware/project_details_pending_proxy"
import { studentRoute } from "./app/middleware/student_profile"
import { adminRouteProxy } from "./app/middleware/admin_route_proxy"


export async function proxy(request: NextRequest) {
    const maintenanceResponse = maintenanceModeCheck(request)
    if (maintenanceResponse.status !== 200) return maintenanceResponse
    const updateSessionResponse = await updateSession(request)
    if (updateSessionResponse.status !== 200) return updateSessionResponse
    let supabaseResponse = NextResponse.next({
        request,
    })
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
    const { data: user } = await supabase.auth.getUser()
    const registerRouteCheck = await registerRoute({ request, user: user.user })
    if (registerRouteCheck.status !== 200) return registerRouteCheck
    const submissionRouteCheck = await submissionRoute({ request, user: user.user })
    if (submissionRouteCheck.status !== 200) return submissionRouteCheck
    const createEventRouteCheck = await createEventRoute({ request, user: user.user })
    if (createEventRouteCheck.status !== 200) return createEventRouteCheck
    const viewAllGroupsEventCheck = await viewAllGroups({ request, user: user.user })
    if (viewAllGroupsEventCheck.status !== 200) return viewAllGroupsEventCheck
    const checkUserInGroup = await userGroupRoute({ request, user: user.user })
    if (checkUserInGroup.status !== 200) return checkUserInGroup
    const submissionReadOnlyRouteCheck = await submissionReadOnlyRoute({ request, user: user.user })
    if (submissionReadOnlyRouteCheck.status !== 200) return submissionReadOnlyRouteCheck
    const editEventRouteCheck = await editEventRoute({ request, user: user.user })
    if (editEventRouteCheck.status !== 200) return editEventRouteCheck
    const submissionGradingRouteCheck = await submissionGradingRoute({ request, user: user.user })
    if (submissionGradingRouteCheck.status !== 200) return submissionGradingRouteCheck
    const eventSubmissionGrading = await eventSubmissionGradingRoute({ request, user: user.user })
    if (eventSubmissionGrading.status !== 200) return eventSubmissionGrading
    const projectManageRouteCheck = await projectsManageRoute({ request, user: user.user })
    if (projectManageRouteCheck.status !== 200) return projectManageRouteCheck
    const projectDetailsPendingRouteCheck = await projectDetailsPendingRoute({ request, user: user.user })
    if (projectDetailsPendingRouteCheck.status !== 200) return projectDetailsPendingRouteCheck
    const studentRouteCheck = await studentRoute({ request, user: user.user })
    if (studentRouteCheck.status !== 200) return studentRouteCheck
    const adminRoute = await adminRouteProxy({ request, user: user.user })
    if (adminRoute.status !== 200) return adminRoute
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}