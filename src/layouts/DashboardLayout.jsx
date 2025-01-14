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
import { Link, NavLink, useNavigate } from "react-router-dom";
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
                <NavLink to="/dashboard" className={NavLinkStyle}>
                    <ListItemPrefix>
                        <HomeIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Dashboard Home
                </NavLink>

                {/* Admin Links */}
                {isAdmin && (
                    <>
                        <Accordion
                            open={open === 1}
                            icon={
                                <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""
                                        }`}
                                />
                            }
                        >
                            <ListItem className="p-0" selected={open === 1}>
                                <AccordionHeader
                                    onClick={() => handleOpen(1)}
                                    className="border-b-0 p-3"
                                >
                                    <ListItemPrefix>
                                        <PresentationChartBarIcon className="h-5 w-5" />
                                    </ListItemPrefix>
                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                        Admin Panel
                                    </Typography>
                                </AccordionHeader>
                            </ListItem>
                            <AccordionBody className="py-1">
                                <List className="p-0">
                                    <NavLink to="/dashboard/manage-users" className={NavLinkStyle}>
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        Manage Users
                                    </NavLink>
                                    <NavLink to="/dashboard/admin-stats" className={NavLinkStyle}>
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        Admin Stats
                                    </NavLink>
                                </List>
                            </AccordionBody>
                        </Accordion>
                    </>
                )}

                {/* HR Links */}
                {isHR && (
                    <>
                        <Accordion
                            open={open === 2}
                            icon={
                                <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""
                                        }`}
                                />
                            }
                        >
                            <ListItem className="p-0" selected={open === 2}>
                                <AccordionHeader
                                    onClick={() => handleOpen(2)}
                                    className="border-b-0 p-3"
                                >
                                    <ListItemPrefix>
                                        <UserPlusIcon className="h-5 w-5" />
                                    </ListItemPrefix>
                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                        HR Panel
                                    </Typography>
                                </AccordionHeader>
                            </ListItem>
                            <AccordionBody className="py-1">
                                <List className="p-0">
                                    <NavLink to="/dashboard/employee-list" className={NavLinkStyle}>
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        Employee List
                                    </NavLink>
                                    <NavLink to="/dashboard/payroll" className={NavLinkStyle}>
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        Payroll
                                    </NavLink>
                                </List>
                            </AccordionBody>
                        </Accordion>
                    </>
                )}

                {/* Employee Links */}
                {isEmployee && (
                    <>
                        <NavLink to="/dashboard/my-tasks" className={NavLinkStyle}>
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            My Tasks
                        </NavLink>
                        <NavLink to="/dashboard/my-salary" className={NavLinkStyle}>
                            <ListItemPrefix>
                                <ShoppingBagIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            My Salary
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

    if(isAdminLoading || isHRLoading || isEmployeeLoading) {
        return <LoadingSpinner/>
    }

    return (
        <div>
            <NavbarDefault />
            <div className="flex">
                <div className="hidden md:block w-[20%] border-2">
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
                <div className="flex-1 p-4">
                    {/* Main content goes here */}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;