// Create a context with a default value of null
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const UserContext = createContext(null);

import Cookies from 'js-cookie';

// Custom hook to use the context
export const useUser = () => {
  return useContext(UserContext);
};

// Provider component to wrap your app with
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  
 const fetchUserData = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    } 
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchUserData();
    
    // Subscribe to auth state changes

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {

        const userData = session.user;
        setUserData(userData);

        // Set the access token to cookies
        Cookies.set('access_token', session.access_token);

        // Fetch data when the user is signed in
        fetchUserData();
      } else if (event === 'SIGNED_OUT') {
        console.log('SIGNED_OUT', session);

        // Remove the access token from cookies
        Cookies.remove('access_token');

      }
    });
  }, []); // Empty dependency array means this effect runs on component mount and unmount

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};
