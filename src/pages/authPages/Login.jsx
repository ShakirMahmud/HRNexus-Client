import {
  Card,
  Input,
  Button,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import { useState } from "react";
import {
  FcGoogle
} from "react-icons/fc";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useGoogleSignIn from "../../hooks/useGoogleSignIn";
import RoleSelectionModal from "./RoleSelectionModal";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import img from '../../assets/login-animation.json'
import Lottie from "lottie-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { userLogin, setUser, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const handleSignIn = async (e) => {
    e.preventDefault();

    setFormErrors({
      email: '',
      password: '',
      general: ''
    });

    const form = new FormData(e.target);
    const email = form.get('email');
    const password = form.get('password');

    try {
      const result = await userLogin(email, password);
      const user = result.user;

      const response = await axiosSecure.get(`/users/check?email=${user.email}`);
      const userData = response.data;

      if (userData.isFired) {
        await logOut();
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: "Your account has been terminated. Please contact support.",
        });
        return;
      }

      // If not fired, allow login
      setUser(user);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have successfully logged in.",
        timer: 2000
      }).then(() => {
        navigate(location?.state ? location?.state : '/');
      })
    } catch (err) {
      console.error(err);

      switch (err.code) {
        case 'auth/invalid-credential':
          setFormErrors(prev => ({
            ...prev,
            general: 'Invalid email or password. Please try again.'
          }));
          break;
        case 'auth/wrong-password':
          setFormErrors(prev => ({
            ...prev,
            password: 'Incorrect password. Please try again.'
          }));
          break;
        case 'auth/user-not-found':
          setFormErrors(prev => ({
            ...prev,
            email: 'No account found with this email address.'
          }));
          break;
        case 'auth/invalid-email':
          setFormErrors(prev => ({
            ...prev,
            email: 'Invalid email format.'
          }));
          break;
        default:
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: err.message,
          });
      }
    }
  };

  const { handleGoogleSignIn } = useGoogleSignIn();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <Card
        className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-2xl rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left Side - Decorative Section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-500 dark:bg-blue-700 p-8 text-white">
          <Typography variant="h3" className="mb-4 text-center">
            Welcome Back!
          </Typography>
          <Typography className="text-center mb-6 text-lg">
            Sign in to continue to your dashboard
          </Typography>
          <Lottie
            animationData={img}
            loop={true}
            className="max-w-full h-[400px] w-full"
            style={{ maxWidth: '500px' }}
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 space-y-6">
          <div className="text-center">
            <Typography variant="h4" color="blue-gray" className="dark:text-white">
              Sign In
            </Typography>
            <Typography color="gray" className="mt-2 dark:text-gray-300 text-lg">
              Enter your credentials to access your account
            </Typography>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
                <Input
                  size="lg"
                  name="email"
                  placeholder="Email address"
                  className={`pl-10 !border-neutral-300 focus:!border-primary-500  dark:bg-dark-neutral-200 dark:text-white dark:caret-white ${formErrors.email ? 'border-red-500' : ''}`}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>
              {formErrors.email && (
                <Typography variant="small" color="red" className="mt-1">
                  {formErrors.email}
                </Typography>
              )}
            </div>

            <div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`pl-10 pr-12 !border-neutral-300 focus:!border-primary-500  dark:bg-dark-neutral-200 dark:text-white dark:caret-white ${formErrors.password ? 'border-red-500' : ''}`}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  icon={
                    showPassword ? (
                      <EyeOffIcon
                        onClick={() => setShowPassword(false)}
                        className="cursor-pointer text-gray-400"
                      />
                    ) : (
                      <EyeIcon
                        onClick={() => setShowPassword(true)}
                        className="cursor-pointer text-gray-400"
                      />
                    )
                  }
                />
              </div>
              {formErrors.password && (
                <Typography variant="small" color="red" className="mt-1">
                  {formErrors.password}
                </Typography>
              )}
            </div>
            {formErrors.general && (
              <Typography variant="small" color="red" className="text-center">
                {formErrors.general}
              </Typography>
            )}

            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              fullWidth
            >
              Sign In
            </Button>
          </form>

          <div className="text-center">
            <Typography color="gray" className="mt-4 dark:text-gray-300">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:text-blue-700">
                Sign Up
              </Link>
            </Typography>

            <div className="my-4 flex items-center justify-center">
              <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
              <span className="px-4 text-gray-500 dark:text-gray-400">or</span>
              <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
            </div>

            <Button
              variant="outlined"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2 w-full border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
            >
              <FcGoogle size={24} />
              Continue with Google
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;