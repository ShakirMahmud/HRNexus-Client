import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";
import useAdmin from "./useAdmin";
import useHR from "./useHR";
import useEmployee from "./useEmployee";

const useGoogleSignIn = () => {
  const { setUser, signInWithGoogle, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const { refetchAdmin} = useAdmin();
  const { refetchHR } = useHR();
  const { refetchEmployee } = useEmployee();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const response = await axiosSecure.get(`/users/check?email=${user.email}`);
      const userData = response.data;
  
      if (!userData.exists && !userData.isFired) {
        const newUserData = {
          name: user.displayName,
          email: user.email,
          roleValue: "Employee",
          image: user.photoURL || generateInitialAvatar(user.displayName),
          bank_account_no: 123456789,
          salary: 0,
          designation: "",
          isVerified: false,
        };
        await axiosPublic.post("/users", newUserData);
      } else if (userData.isFired) {
        console.log("User is fired");
        await logOut();
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Your account has been terminated. Please contact support.",
        });
        return;
      }
  
      // Refetch roles before navigation
      setUser(user);
      await Promise.all([refetchAdmin(), refetchHR(), refetchEmployee()]);
      navigate(location?.state || "/");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: err.message,
      });
    }
  };
  

  return { handleGoogleSignIn, };
};

export default useGoogleSignIn;
