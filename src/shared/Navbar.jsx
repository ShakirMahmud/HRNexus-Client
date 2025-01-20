import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { User, LogOut, UserCircle } from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import useHR from "../hooks/useHR";
import useEmployee from "../hooks/useEmployee";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];
const NavbarDefault = () => {
  const { isAdmin, isAdminLoading, refetchAdmin } = useAdmin();
  const { isHR, isHRLoading, refetchHR } = useHR();
  const { isEmployee, isEmployeeLoading, refetchEmployee } = useEmployee();
  const [openNav, setOpenNav] = useState(false);
  const { user, logOut, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) setUserRole("Admin");
      else if (isHR) setUserRole("HR");
      else if (isEmployee) setUserRole("Employee");
    }
  }, [isAdmin, isHR, isEmployee, loading, user]);
  

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
    return () => window.removeEventListener("resize", () => { });
  }, []);

  const dashboardLinks = useMemo(() => {
    if (isAdminLoading || isHRLoading || isEmployeeLoading) {
      return [
        {
          key: "dashboard-loading",
          component: (
            <Typography
              key="dashboard-loading"
              as="li"
              variant="small"
              className="p-1 font-medium text-neutral-400 dark:text-neutral-600 animate-pulse"
            >
              Loading...
            </Typography>
          ),
        },
      ];
    }
    if (isAdmin) return [{ key: "admin-dashboard", name: "Admin Dashboard", path: "/dashboard/admin" }];
    if (isHR) return [{ key: "hr-dashboard", name: "HR Dashboard", path: "/dashboard/hr" }];
    if (isEmployee) return [{ key: "employee-dashboard", name: "Employee Dashboard", path: "/dashboard/employee" }];
    return [];
  }, [isAdmin, isHR, isEmployee, isAdminLoading, isHRLoading, isEmployeeLoading]);
  
  

  // Navigation List with active state styling
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {/* Base navigation links */}
      {navLinks.map((item) => (
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

      {/* Dashboard links */}
      {dashboardLinks.map((link) => 
        link.component ? (
          link.component
        ) : (
          <Typography
            key={link.key}
            as="li"
            variant="small"
            className="p-1 font-medium 
              text-neutral-800 dark:text-dark-text-primary 
              hover:text-primary-500 dark:hover:text-primary-400"
          >
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400"
                  : ""
              }
            >
              {link.name}
            </NavLink>
          </Typography>
        )
      )}
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
            { loading ? 
            (
              <div className="flex items-center gap-2">
                <div 
                  className="w-20 h-8 bg-neutral-200 dark:bg-dark-neutral-300 
                  animate-pulse rounded-md"
                />
                <div 
                  className="w-20 h-8 bg-neutral-200 dark:bg-dark-neutral-300 
                  animate-pulse rounded-md"
                />
              </div>
            ) :

            user && user?.email ?

              <div className="hidden lg:flex items-center gap-2">
                <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                  <MenuHandler>
                    <div
                      className="rounded-full 
                                 bg-primary-100 text-primary-600 
                                 dark:bg-primary-900/20 dark:text-primary-400
                                 hover:bg-primary-200 dark:hover:bg-primary-800/30 p-0 w-10 h-10"
                    >
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="User Profile"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircle className="h-10 w-10" />
                      )}
                    </div>
                  </MenuHandler>
                  <MenuList className="dark:bg-dark-neutral-200 dark:border-dark-neutral-300">
                    <MenuItem
                      onClick={logOut}
                      className="flex items-center gap-2 dark:text-neutral-100 dark:hover:bg-dark-neutral-300"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
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
      {/* Mobile Navigation Collapse */}
      <Collapse
        open={openNav}
        className="bg-neutral-50 dark:bg-dark-background transition-colors duration-300"
      >
        {navList}
        <div className="flex flex-col items-center gap-x-1">
          {!user ? (
            <>
              <Button
                fullWidth
                onClick={() => navigate('/login')}
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
                onClick={() => navigate('/register')}
                variant="gradient"
                size="sm"
                className="bg-gradient-to-r 
            from-primary-500 to-primary-600
            dark:from-primary-400 dark:to-primary-500"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center justify-center gap-3 mb-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <UserCircle className="h-10 w-10 text-neutral-600 dark:text-neutral-300" />
                )}
                <Typography
                  variant="small"
                  className="font-medium text-neutral-800 dark:text-neutral-100"
                >
                  {user.displayName || user.email}
                </Typography>
              </div>
              <Button
                fullWidth
                onClick={logOut}
                variant="outlined"
                color="red"
                size="sm"
                className="flex items-center justify-center gap-2
            border-danger-500 text-danger-500
            dark:border-danger-400 dark:text-danger-400"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </Collapse>
    </Navbar >
  );
};

export default NavbarDefault;