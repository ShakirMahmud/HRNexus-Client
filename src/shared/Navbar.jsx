import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import { User, LogOut } from "lucide-react"; 

const NavbarDefault = () => {
  const [openNav, setOpenNav] = useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  // Navigation Links with active state styling
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        className="p-1 font-medium text-neutral-800 hover:text-primary-500"
      >
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive 
              ? "text-primary-500 border-b-2 border-primary-500" 
              : ""
          }
        >
          Home
        </NavLink>
      </Typography>
      <Typography
        as="li"
        variant="small"
        className="p-1 font-medium text-neutral-800 hover:text-primary-500"
      >
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            isActive 
              ? "text-primary-500 border-b-2 border-primary-500" 
              : ""
          }
        >
          Dashboard
        </NavLink>
      </Typography>
      <Typography
        as="li"
        variant="small"
        className="p-1 font-medium text-neutral-800 hover:text-primary-500"
      >
        <NavLink 
          to="/contact" 
          className={({ isActive }) => 
            isActive 
              ? "text-primary-500 border-b-2 border-primary-500" 
              : ""
          }
        >
          Contact
        </NavLink>
      </Typography>
    </ul>
  );

  return (
    <Navbar 
      className="sticky top-0 z-50 h-max max-w-full rounded-none py-2  lg:py-4 bg-neutral-50 shadow-md"
    >
      <div className="w-11/12 lg:w-4/5 mx-auto   flex items-center justify-between text-neutral-900">
        {/* Logo */}
        <Typography
          as={NavLink}
          to="/"
          className="mr-4 cursor-pointer py-1.5 font-bold text-primary-600 text-xl"
        >
          HRNexus
        </Typography>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          
          {/* Authentication Buttons */}
          <div className="flex items-center gap-x-2">
            {/* Conditional Rendering for Auth Buttons */}
            <Button
              variant="outlined"
              size="sm"
              className="hidden lg:inline-block border-primary-500 text-primary-500 hover:bg-primary-50"
            >
              Log In
            </Button>
            <Button
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            >
              Sign Up
            </Button>

            {/* User Profile / Logout */}
            <div className="hidden lg:flex items-center gap-2">
              <IconButton 
                variant="text" 
                className="rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200"
              >
                <User className="h-5 w-5" />
              </IconButton>
              <IconButton 
                variant="text" 
                className="rounded-full bg-danger-100 text-danger-600 hover:bg-danger-200"
              >
                <LogOut className="h-5 w-5" />
              </IconButton>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-neutral-800 hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
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
      <Collapse open={openNav} className="bg-neutral-50">
        {navList}
        <div className="flex flex-col items-center gap-x-1">
          <Button 
            fullWidth 
            variant="outlined" 
            size="sm" 
            className="mb-2 border-primary-500 text-primary-500"
          >
            Log In
          </Button>
          <Button 
            fullWidth 
            variant="gradient" 
            size="sm" 
            className="bg-gradient-to-r from-primary-500 to-primary-600"
          >
            Sign Up
          </Button>
        </div>
      </Collapse>
    </Navbar>
  );
};

export default NavbarDefault;