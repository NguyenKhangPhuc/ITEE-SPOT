/**
 * PURPOSE:
 * Server Component for the account verification page.
 * Extracts email query parameter and mounts VerifyAccount inside a dark terminal layout.
 *
 * CONTEXT/PARENT FILE:
 * Mounted at 'app/sign-up/verify-account/page.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - searchParams (Promise<{ email?: string }>): URL query parameter resolution object.
 */

import VerifyAccount from "./VerifyAccountClient"
import BackButton from "@/app/components/BackButton"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: PageProps) {
  const resolveSearchParams = await searchParams
  const userEmail = (resolveSearchParams.email as string) || ""

  return (
    <div className="w-full min-h-screen bg-[#151312] text-[#e8e1df] font-mono flex items-center justify-center p-6 py-12 select-none">
      <div className="w-full max-w-md flex flex-col gap-6">
        <BackButton />
        <VerifyAccount email={userEmail} />
      </div>
    </div>
  )
}