import { NextRequest, NextResponse } from "next/server";

export function maintenanceModeCheck(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
    if (isMaintenanceMode) {
        if (
            request.nextUrl.pathname.startsWith('/_next') ||
            pathname.startsWith('/maintenance')
        ) {
            return NextResponse.next();
        }
        const url = request.nextUrl.clone()
        url.pathname = '/maintenance'
        return NextResponse.redirect(url)
    }

    return NextResponse.next();
}