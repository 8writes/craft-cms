import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

const UserContext = createContext(null)

// Custom hook to use the context
export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null)
  const router = useRouter()

      const fetchedUserData = async () => {
      
        try {
          
          const session = localStorage.getItem('auth-token')

          if (!session) {
            if (router.pathname !== '/login' && router.pathname !== '/register') {
              router.push('/login')
            }
          }
          const sessionData = JSON.parse(session) 

          const userSessionData = sessionData || null
          
          const response = await axios.get(`https://craftserver.onrender.com/v1/api/fetchuser?id=${userSessionData.id}`)
          
          const { error, data } = response.data

          if (error) {
            setFailed(error.message)
          }
          
            setUserData(data[0])
  
        } catch (error) {
          console.log(error)
        } 
      }
  
  useEffect(() => {
    if (!userData) {
      fetchedUserData()
    }
  }, [router.pathname])

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>
}
