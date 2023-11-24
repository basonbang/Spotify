/*
  Custom hook for user-related data. Contains React context, allowing us to easily access and share user data across components
  Context: A way to share data (props) across many components without needing to manually pass it to each component down the tree
*/

import { useEffect, useState, createContext, useContext } from 'react';
import { useUser as useSupaUser, useSessionContext, User } from '@supabase/auth-helpers-react';

import { UserDetails, Subscription } from '@/types';

// Outlines the structure of user context, if properties are absent they are null.
type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

// Creates new context object for user data, if no Provider is found in component tree, context is defaulted to undefined
export const UserContext = createContext<UserContextType | undefined>( undefined );

// Prop interface that can have any number of properties with any type
export interface Props {
  [propName: string]: any;
}

// Component that is a provider for the UserContext. Fetches and stores user-related data, then passes it down to child components
export const MyUserContextProvider = (props: Props) => {

  // Extract various properties from the session context object
  const {
    session,  // Contain session data like access token
    isLoading: isLoadingUser, 
    supabaseClient: supabase  // Supabase client instance for making database queries, renamed to supabase
  } = useSessionContext();  

  // Retrieve current logged-in user's info such as: email, username, etc
  const user = useSupaUser();

  // extract session's access token if it session exists, otherwise set it to null
  const accessToken = session?.access_token ?? null;

  // User details and subscriptions are initially null, and data is not officially loaded yet
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); 
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () =>
    supabase
      .from('subscriptions')  
      .select('*, prices(*, products(*))') 
      .in('status', ['trialing', 'active'])
      .single();

  // Fetches additional user & subscription details from Supabase when user logs in
  useEffect(() => {
    // Check if user is logged in and if data isn't already loading or loaded
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);
      // Concurrently fetch user details and subscription from Supabase
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          // Update user detail and subscription states once fetched
          if (userDetailsPromise.status === 'fulfilled')
            setUserDetails(userDetailsPromise.value.data as UserDetails);

          if (subscriptionPromise.status === 'fulfilled')
            setSubscription(subscriptionPromise.value.data as Subscription);

          setIsLoadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);

  // Contains all user-related data that context object will provide to consumers
  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription
  };

  // Makes user data along with any additonal props available to any child components
  return <UserContext.Provider value={value} {...props} />;
};

// Allows other components to easily access user context
export const useUser = () => {  
  const context = useContext(UserContext);  // Access user context
  if (context === undefined) {  // if 'useUser' is used outside of a <UserContext.Provider>
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};