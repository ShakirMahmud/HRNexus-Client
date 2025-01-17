import React, { useState } from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Drawer,
    Button,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
    UserPlusIcon,
    HomeIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import useHR from "../hooks/useHR";
import useEmployee from "../hooks/useEmployee";
import NavbarDefault from "../shared/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

const DashboardLayout = () => {
    const [open, setOpen] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user, logOut } = useAuth();
    const { isAdmin, isAdminLoading } = useAdmin();
    const { isHR, isHRLoading } = useHR();
    const { isEmployee, isEmployeeLoading } = useEmployee();
    const navigate = useNavigate();

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const handleLogout = () => {
        logOut()
            .then(() => {
                navigate('/login');
            })
            .catch(error => console.error(error));
    };

    const NavLinkStyle = ({ isActive }) =>
        `flex items-center gap-3 py-3 px-4 rounded-lg ${isActive
            ? "bg-blue-500 text-white"
            : "text-gray-700 hover:bg-blue-50"
        }`;

    const DashboardContent = () => (
        <Card
            color="transparent"
            shadow={false}
            className="h-[calc(100vh-2rem)] w-full p-4 overflow-y-auto"
        >
            <div className="mb-6 flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                {/* <UserCircleIcon className="h-12 w-12 text-blue-500" /> */}
                <div className=" flex items-center justify-center h-12 w-12">
                    <img src={user?.photoURL} className="h-12 w-12 rounded-full object-cover object-center " alt="" />
                </div>
                <div>
                    <Typography variant="h6" color="blue-gray">
                        {user?.displayName || 'Dashboard User'}
                    </Typography>
                    <Typography variant="small" color="gray" className="font-normal">
                        {user?.email}
                    </Typography>
                </div>
            </div>

            <List>
                {/* Home Link */}
                <NavLink end to="/dashboard" className={NavLinkStyle}>
                    <ListItemPrefix>
                        <HomeIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Dashboard Home
                </NavLink>

                {/* Admin Links */}
                {isAdmin && (
                    <>
                        <NavLink
                            to="/dashboard/all-employee-list"
                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3 px-4 rounded-lg ${isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-50"
                                }`
                            }
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            All Employee List
                        </NavLink>
                        <NavLink
                            to="/dashboard/payroll"
                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3 px-4 rounded-lg ${isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-50"
                                }`
                            }
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Payroll
                        </NavLink>
                    </>
                )}

                {/* HR Links */}
                {isHR && (
                    <>
                        <NavLink
                            to="/dashboard/employee-list"

                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3 px-4 rounded-lg ${isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-50"
                                }`
                            }
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Employee List
                        </NavLink>
                        <NavLink
                            to="/dashboard/progress"

                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3 px-4 rounded-lg ${isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-50"
                                }`
                            }
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Progress
                        </NavLink>
                        <NavLink
                            to="/dashboard/payment_history"

                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3 px-4 rounded-lg ${isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-50"
                                }`
                            }
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Payment History
                        </NavLink>
                    </>
                )}

                {/* Employee Links */}
                {isEmployee && (
                    <>
                        <NavLink
                            to="/dashboard/work-sheet"

                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3 px-4 rounded-lg ${isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-50"
                                }`
                            }
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            My Work-Sheet
                        </NavLink>
                        <NavLink
                            to="/dashboard/payment-history"

                            className={({ isActive }) =>
                                `flex items-center gap-3 py-3 px-4 rounded-lg ${isActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-700 hover:bg-blue-50"
                                }`
                            }
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Payment History
                        </NavLink>
                    </>
                )}

                {/* Common Links */}
                <NavLink to="/dashboard/profile" className={NavLinkStyle}>
                    <ListItemPrefix>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Profile Settings
                </NavLink>

                <ListItem onClick={handleLogout} className=" cursor-pointer px-4">
                    <ListItemPrefix>
                        <PowerIcon className="h-5 w-5 text-red-500" />
                    </ListItemPrefix>
                    Logout
                </ListItem>
            </List>
        </Card>
    );

    if (isAdminLoading || isHRLoading || isEmployeeLoading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            {/* <NavbarDefault /> */}
            <div className="flex">
                <div className="hidden md:block w-[20%] border-2 pt-10">
                    <DashboardContent />
                </div>
                <div className="md:hidden">
                    <Button onClick={openDrawer} className="mb-4">
                        Open Menu
                    </Button>
                    <Drawer
                        open={isDrawerOpen}
                        onClose={closeDrawer}
                        className="w-64"
                    >
                        <DashboardContent />
                    </Drawer>
                </div>
                <div className="flex-1 p-4 pt-10">
                    {/* Main content goes here */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;