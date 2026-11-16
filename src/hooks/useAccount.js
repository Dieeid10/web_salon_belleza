import { useEffect, useState } from "react"
import { getSupabase } from "../lib/supabase"

export function useAccount() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    try {
      const { data: { subscription } } =
        getSupabase().auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession)
          setLoading(false)
        })

      return () => subscription.unsubscribe()
    } catch {
      setError("No se pudo iniciar el cliente de Supabase.")
      setLoading(false)
    }
  }, [])

  async function signIn() {
    setError("")

    try {
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/google/callback`,
        },
      })

      if (error) throw error
    } catch {
      setError("No se pudo ingresar con Google.")
    }
  }

  async function signOut() {
    setError("")

    try {
      const { error } = await getSupabase().auth.signOut({ scope: "local" })
      if (error) throw error
    } catch {
      setError("No se pudo cerrar la sesión.")
    }
  }

  function openDialog(id) {
    document.getElementById(id)?.showModal()
  }

  const metadata = session?.user.user_metadata
  const name = metadata?.full_name || metadata?.name || "Mi cuenta"

  return { session, loading, error, name, signIn, signOut, openDialog }
}