import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const Login = () => {
  const [isClicked, setIsClicked] = useState(true);
  const { userLogin, setUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

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

  const handleSignInWithGoogle = () => {
    signInWithGoogle()
      .then(result => {
        const user = result.user;
        setUser(user);
        navigate('/');
      })
      .catch(err => {
        console.error(err);
      })

  }

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
      </div>
    </Card>
  );
};

export default Login;