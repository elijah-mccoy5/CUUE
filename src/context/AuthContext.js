import React, { useContext, useEffect, useState } from 'react'
import {auth} from '../firebase'

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext)
}
export function AuthProvider({children}){

    // Sets state for the Current users authentication
        const [currentUser, setCurrentUser] = useState();

    // Sets state to unsubscribe to useEffect and ensures that users dont create multiple accounts on accident
        const [loading, setLoading] = useState(true);

    const signup = (email, password) => {
            return auth.createUserWithEmailAndPassword(email, password)
    }
    useEffect(() => {
    // Unsubscribes to useEffect and ensures that users dont create multiple accounts on accident
   
        const unsubscribe = auth.onAuthStateChanged(user => {
        // Sets currentUser state to match the state of authetication (Account created || Account not created)
            setCurrentUser(user)

        // Sets loading state to to false so that user may only submit one form
            setLoading(false)
        })
        //returns the value of unsubscribe as a single function to check two conditions (If the form is loading and being proccessed and If the users account has been made)
            return unsubscribe;
    }, [])

    // This value variable is made to pass the signup function and currentUser as a single prop, to be processd and authenticated asynchronously with firebase
        const value = {
            currentUser,
            signup
        }
return(
//This AuthContext.Provider tag isto make the react app aware that there ARE authentication conditons
//And also checks teh condiotnd inside the tags
    <AuthContext.Provider value={value}>
    {!loading && children}
    </AuthContext.Provider>
)
}