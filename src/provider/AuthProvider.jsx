import { createContext, useEffect, useState } from "react";
import { auth } from './../firebase/firebase.config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

export const AuthContext = createContext();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();
    const axiosPublic = useAxiosPublic();


    //create user
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    //login
    const userLogin = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    
    //logout
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }
    
    //update profile
    const updateUserProfile = updatedData => {
        return updateProfile(auth.currentUser, updatedData);
    }
    
    //google sign in
    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }
    //auth info
    const authInfo = {
        user,
        setUser,
        createUser,
        userLogin,
        logOut,
        updateUserProfile,
        signInWithGoogle,
        loading,

    }

    //observer
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
    
            if (currentUser) {
                // setUser(currentUser)
    
                try {
                    const response = await axiosPublic.get(`/users/check?email=${currentUser.email}`);
                    const userData = response.data;
    
                    if (userData.isFired) {
                        await logOut();
                        Swal.fire({
                            icon: "error",
                            title: "Access Denied",
                            text: "Your account has been terminated. Please contact support.",
                        });
                    } 
                    else {
                        // User is valid; set token
                        const userInfo = { email: currentUser.email };
                        const tokenResponse = await axiosPublic.post('/jwt', userInfo);
                        if (tokenResponse.data.token) {
                            setUser(currentUser);
                            localStorage.setItem('token', tokenResponse.data.token);
                        }
                    }
                } catch (error) {
                    console.error("Error checking user state:", error);
                }
            } else {
                setUser(null);
                localStorage.removeItem('token');
            }
    
            setLoading(false);
        });
    
        return () => {
            unsubscribe();
        };
    }, []);
    

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
// com