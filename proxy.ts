import { type NextRequest } from "next/server"
import { updateSession } from "./app/utils/supabase/proxy"
import { registerRoute } from "./app/middleware/register_proxy"
import { submissionRoute } from "./app/middleware/submission_proxy"
import { createEventRoute } from "./app/middleware/create_event_proxy"
import { viewAllGroups } from "./app/middleware/view_all_groups"
import { userGroupRoute } from "./app/middleware/user_group"
import { submissionReadOnlyRoute } from "./app/middleware/submission_read_only"
import { editEventRoute } from "./app/middleware/edit_event_proxy"


export async function proxy(request: NextRequest) {
    const supabaseResponse = await updateSession(request)
    if (supabaseResponse.status !== 200) return supabaseResponse
    const registerRouteCheck = await registerRoute(request)
    if (registerRouteCheck.status !== 200) return registerRouteCheck
    const submissionRouteCheck = await submissionRoute(request)
    if (submissionRouteCheck.status !== 200) return submissionRouteCheck
    const createEventRouteCheck = await createEventRoute(request)
    if (createEventRouteCheck.status !== 200) return createEventRouteCheck
    const viewAllGroupsEventCheck = await viewAllGroups(request)
    if (viewAllGroupsEventCheck.status !== 200) return viewAllGroupsEventCheck
    const checkUserInGroup = await userGroupRoute(request)
    if (checkUserInGroup.status !== 200) return checkUserInGroup
    const submissionReadOnlyRouteCheck = await submissionReadOnlyRoute(request)
    if (submissionReadOnlyRouteCheck.status !== 200) return submissionReadOnlyRouteCheck
    const editEventRouteCheck = await editEventRoute(request)
    if (editEventRouteCheck.status !== 200) return editEventRouteCheck
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