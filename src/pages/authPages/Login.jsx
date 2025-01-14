import {
  Card,
  Input,
  Button,
  Typography,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useCallback, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/useAxiosPublic";
const Login = () => {
  const [isClicked, setIsClicked] = useState(true);
  const { userLogin, setUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [pendingUser, setPendingUser] = useState(null);

  const handleSignIn = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get('email');
    const password = form.get('password');
    userLogin(email, password)
      .then(result => {
        const user = result.user;
        setUser(user);
        navigate('/');
      })
      .catch(err => {
        console.error(err);
      })
  }

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      // Check if user exists in database
      const response = await axiosPublic.get(`/users/check?email=${user.email}`);

      // If user exists and has a role, navigate directly
      if (response.data.exists && response.data.roleValue) {
        setUser(user);
        navigate('/');
        return;
      }

      // If no role, always open modal
      setPendingUser(user);
      setIsRoleModalOpen(true);
      setSelectedRole(''); // Reset selected role
    }
    catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Google Sign In Failed',
        text: err.message
      });
    }
  }

  // Prevent unnecessary re-renders
  const handleRoleSelection = useCallback(async () => {
    if (!pendingUser || !selectedRole) {
      Swal.fire({
        icon: 'error',
        title: 'Role Selection Required',
        text: 'Please select a role to continue'
      });
      return;
    }

    try {
      const userData = {
        name: pendingUser.displayName,
        email: pendingUser.email,
        roleValue: selectedRole,
        image: pendingUser.photoURL || generateInitialAvatar(pendingUser.displayName)
      };

      await axiosPublic.post('/users', userData);

      setUser(pendingUser);
      setIsRoleModalOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error adding user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Unable to complete registration'
      });
    }
  }, [pendingUser, selectedRole, axiosPublic, navigate, setUser]);

  // Role Selection Modal
  const RoleSelectionModal = () => (
    <Dialog
      open={isRoleModalOpen}
      handler={() => { }}
      dismissible={false}
      animate={{
        mount: { scale: 1, opacity: 1 },
        unmount: { scale: 0.9, opacity: 0 },
      }}
      className="bg-transparent shadow-none"
    >
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
        <DialogHeader>Select Your Role</DialogHeader>
        <DialogBody>
          <Select
            label="Choose Your Role"
            value={selectedRole}
            onChange={(value) => setSelectedRole(value)}
          >
            <Option value="Employee">Employee</Option>
            <Option value="HR">HR</Option>
          </Select>
        </DialogBody>
        <DialogFooter>
          {/* Remove cancel button */}
          <Button
            variant="gradient"
            color="green"
            onClick={handleRoleSelection}
            disabled={!selectedRole} // Disable until role is selected
          >
            Confirm Role
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );

  return (
    <Card color="transparent" shadow={false} className="w-full min-h-screen flex justify-center items-center">
      <Typography variant="h4" color="blue-gray">
        Sign In
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Welcome back! Please enter your details.
      </Typography>
      <form onSubmit={handleSignIn} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input
            size="lg"
            name="email"
            placeholder="name@mail.com"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Password
          </Typography>
          <Input
            type="password"
            name="password"
            size="lg"
            placeholder="********"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>

        <Button type="submit" className="mt-6" fullWidth>
          sign in
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <Link to="/register" className="font-medium text-gray-900">
            Sign In
          </Link>
        </Typography>
      </form>

      <div className="w-full flex justify-center py-6">
        <button
          onClick={handleSignInWithGoogle}
          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 rounded-lg shadow hover:shadow-md transition-all duration-300 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FcGoogle size={24} />
          <span className="text-lg font-medium">Log In with Google</span>
        </button>
        <RoleSelectionModal />
      </div>
    </Card>
  );
};

export default Login;