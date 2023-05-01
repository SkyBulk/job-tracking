"use client"

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

import { Database } from "@/types/database"
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"

type SupabaseContext = {
	supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [supabase] = useState(() => createBrowserSupabaseClient())
	const router = useRouter()

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			router.refresh()
			// router.push("/jobs")
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [router, supabase])

	return (
		<Context.Provider value={{ supabase }}>
			<>{children}</>
		</Context.Provider>
	)
}

export const useSupabase = () => {
	const context = useContext(Context)

	if (context === undefined) {
		throw new Error("useSupabase must be used inside SupabaseProvider")
	}

	return context
}
