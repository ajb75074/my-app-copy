//navbar component for logo and signout
"use client"

import { signOut, useSession } from "next-auth/react"
import Image from 'next/image'

export default function Navbar() {
  const { data: session, status } = useSession()

  // check if session is loading
  if (status === "loading") {
    return (
      <nav className="flex items-center justify-between p-4 bg-primary-background text-primary-text fixed top-0 left-0 w-full z-10">
        <div className="flex items-center">
          <Image src={"/GrowBeetsLogo.png"} alt="Logo" width={100} height={100} />

        </div>
      </nav>
    )
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-primary-background text-primary-text">
      {/* logo */}
      <div className="flex items-center">
        <Image src={"/GrowBeetsLogo.png"} alt="Logo" width={100} height={100} />
      </div>

      {/* sign out button, uses session data to sign out of everything and changes user permissions if logged out */}
      <div>
        {session ? (
          <button
            className="bg-primary-background text-primary-text px-4 py-2 rounded-md font-aileron"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        ) : null}
      </div>
    </nav>
  )
}
