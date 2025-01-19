import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";

const useGoogleSignIn = () => {
  const { setUser, signInWithGoogle, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [role, setRole] = useState("");

  const handleGoogleSignIn = async () => {
    try {
        const result = await signInWithGoogle();
        const user = result.user;

        // Check if user exists and their status
        const response = await axiosSecure.get(`/users/check?email=${user.email}`);
        const userData = response.data;
        console.log('userData', userData);

        if (userData.exists && !userData.isFired && userData.roleValue) {
            // User is valid and has a role
            setUser(user);
            navigate("/");
        } else if (userData.isFired) {
          console.log('User is fired');
            // Fired user
            await logOut();
            Swal.fire({
                icon: "error",
                title: "Access Denied",
                text: "Your account has been terminated. Please contact support.",
            });
        } else {
            // New user or role pending
            setPendingUser(user);
            setIsRoleModalOpen(true);
        }
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: "error",
            title: "Google Sign-In Failed",
            text: err.message,
        });
    }
};

  const handleRoleConfirm = async ({ role, bankAccountNo }) => {
    console.log(role);
    try {
      const userData = {
        name: pendingUser.displayName,
        email: pendingUser.email,
        roleValue: role,
        image: pendingUser.photoURL || generateInitialAvatar(pendingUser.displayName),
        bank_account_no: bankAccountNo,
        salary: role === 'HR' ? 2500 : 0,
        designation: '',
        isVerified: false
      };

      await axiosPublic.post("/users", userData);
      setUser(pendingUser);
      setIsRoleModalOpen(false);
      navigate(location?.state ? location?.state : '/');
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Unable to complete registration.",
      });
    }
  };
  return {
    isRoleModalOpen,
    setIsRoleModalOpen,
    handleGoogleSignIn,
    handleRoleConfirm,
    role,
    setRole,
  };
};

export default useGoogleSignIn;
