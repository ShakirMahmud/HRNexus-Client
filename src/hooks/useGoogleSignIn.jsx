import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";

const useGoogleSignIn = () => {
  const { setUser, signInWithGoogle } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [role, setRole] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const response = await axiosSecure.get(`/users/check?email=${user.email}`);
      if (response.data.exists && response.data.roleValue) {
        setUser(user);
        navigate("/");
        return;
      }
      setPendingUser(user);
      setIsRoleModalOpen(true);
      setRole("");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Google Sign In Failed",
        text: err.message,
      });
    }
  };

  const handleRoleConfirm = async ({ role, bankAccountNo }) => {
    try {
      const userData = {
        name: pendingUser.displayName,
        email: pendingUser.email,
        roleValue: role,
        image: pendingUser.photoURL || generateInitialAvatar(pendingUser.displayName),
        bank_account_no: bankAccountNo,
        salaryPerHour: roleValue === 'HR' ? 2500 : 0,
        designation: '',
        isVerified: false
      };

      await axiosPublic.post("/users", userData);
      setUser(pendingUser);
      setIsRoleModalOpen(false);
      navigate("/");
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
