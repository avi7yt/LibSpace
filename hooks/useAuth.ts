import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { router } from 'expo-router'

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const rollNo = user?.email?.split('@')[0] || ''
  const fullName = user?.user_metadata?.full_name || 
                  user?.user_metadata?.name || rollNo
  const email = user?.email || ''
  const isLoggedIn = !!user

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return { user, rollNo, fullName, email, isLoggedIn, loading, signOut }
}
