import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const UserContext = createContext(null)

// Custom hook to use the context
export const useUser = () => {
  return useContext(UserContext)
}

// Provider component to wrap your app with
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  const router = useRouter()

  // Subscribe to auth state changes
  const authListener = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
      setUserData(session.user)
    }
  })

  useEffect(() => {
    const session = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.log(error.message)
        }
        if (data.session === null) {
          router.push('/login')
          console.log(data)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    session()
  }, []) // Add router to the dependency array

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (data) {
          setUserData(data.user)
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message)
      }
    }
    fetchUserData()
  }, []) // Empty dependency array

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>
}
