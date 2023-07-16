"use client"

import { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"
import { useUserStore } from "@/hooks/useUserStore"

export function useUserListener() {
  const supabase = createClientComponentClient<Database>()
  const { setUser } = useUserStore()
  // A hook that acts as an event listener when defined in the root layout
  useEffect(() => {
    // 1. populates the state on page load/reload with db values (for security reasons)
    const init = async () => {
      const { data } = await supabase
        .from("users")
        .select("name, is_admin")
        .single()

      if (data) {
        localStorage.setItem("local", JSON.stringify(data))
        setUser(data)
      } else {
        setUser(null)
      }
    }
    init()
    // 2. updates state and local storage depending on authentication level change
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        init()
      } else if (event === "SIGNED_OUT") {
        localStorage.removeItem("local")
        setUser(null)
      }
    })
    // 3. updates state and local storage based on realtime db updates
    const channel = supabase
      .channel("realtime data")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
        },
        (payload) => {
          const user = {
            name: payload.new.name,
            is_admin: payload.new.is_admin,
          }
          localStorage.setItem("local", JSON.stringify(user))
          setUser(user)
        }
      )
      .subscribe()
    // clears the hook on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}