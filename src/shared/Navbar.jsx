import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { User, LogOut } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";
import useAuth from "../hooks/useAuth";

const NavbarDefault = () => {
  const [openNav, setOpenNav] = useState(false);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  // Navigation Links with active state styling
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {[
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Contact', path: '/contact' }
      ].map((item) => (
        <Typography
          key={item.path}
          as="li"
          variant="small"
          className="p-1 font-medium 
            text-neutral-800 dark:text-dark-text-primary 
            hover:text-primary-500 dark:hover:text-primary-400"
        >
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400"
                : ""
            }
          >
            {item.name}
          </NavLink>
        </Typography>
      ))}
    </ul>
  );

  return (
    <Navbar
      className=" border-none sticky top-0 z-50 h-max max-w-full rounded-none py-2 lg:py-4 
        bg-neutral-50 dark:bg-dark-background 
        text-neutral-900 dark:text-dark-text-primary 
        shadow-md dark:shadow-dark-card 
        transition-colors duration-300"
    >
      <div className="w-11/12 lg:w-4/5 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Typography
          as={NavLink}
          to="/"
          className="mr-4 cursor-pointer py-1.5 font-bold 
            text-primary-600 dark:text-primary-400 
            text-xl flex items-center gap-2"
        >
          HRNexus
        </Typography>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>

          {/* Authentication Buttons */}
          <div className="flex items-center gap-x-2">
            <DarkModeToggle />
            {/* Conditional Rendering for Auth Buttons */}
            {user && user?.email ?

              <div className="hidden lg:flex items-center gap-2">
                <IconButton
                  variant="text"
                  className="rounded-full 
                  bg-primary-100 text-primary-600 
                  dark:bg-primary-900/20 dark:text-primary-400
                  hover:bg-primary-200 dark:hover:bg-primary-800/30"
                >
                  <User className="h-5 w-5" />
                </IconButton>
                <IconButton
                  onClick={logOut}
                  variant="text"
                  className="rounded-full 
                  bg-danger-100 text-danger-600 
                  dark:bg-danger-900/20 dark:text-danger-400
                  hover:bg-danger-200 dark:hover:bg-danger-800/30"
                >
                  <LogOut className="h-5 w-5" />
                </IconButton>
              </div>
              :
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outlined"
                  size="sm"
                  className="hidden lg:inline-block 
                border-primary-500 text-primary-500 
                dark:border-primary-400 dark:text-primary-400
                hover:bg-primary-50 dark:hover:bg-primary-900/20"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  variant="gradient"
                  size="sm"
                  className="hidden lg:inline-block 
                bg-gradient-to-r from-primary-500 to-primary-600 
                dark:from-primary-400 dark:to-primary-500 
                hover:from-primary-600 hover:to-primary-700 
                dark:hover:from-primary-500 dark:hover:to-primary-600"
                >
                  Sign Up
                </Button>
              </div>
            }


          </div>

          {/* Mobile Menu Toggle */}
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 
              text-neutral-800 dark:text-dark-text-primary
              hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>

      {/* Mobile Navigation Collapse */}
      <Collapse
        open={openNav}
        className="bg-neutral-50 dark:bg-dark-background transition-colors duration-300"
      >
        {navList}
        <div className="flex flex-col items-center gap-x-1">
          <Button
            fullWidth
            variant="outlined"
            size="sm"
            className="mb-2 
              border-primary-500 text-primary-500
              dark:border-primary-400 dark:text-primary-400"
          >
            Log In
          </Button>
          <Button
            fullWidth
            variant="gradient"
            size="sm"
            className="bg-gradient-to-r 
              from-primary-500 to-primary-600
              dark:from-primary-400 dark:to-primary-500"
          >
            Sign Up
          </Button>
        </div>
      </Collapse>
    </Navbar >
  );
};

export default NavbarDefault;