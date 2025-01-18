import React, { useState } from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Drawer,
    Button,
} from "@material-tailwind/react";
import {
    HomeIcon,
    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import { Menu, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import useHR from "../hooks/useHR";
import useEmployee from "../hooks/useEmployee";
import NavbarDefault from "../shared/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import Footer from "../shared/Footer";

const DashboardLayout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user, logOut } = useAuth();
    const { isAdmin, isAdminLoading } = useAdmin();
    const { isHR, isHRLoading } = useHR();
    const { isEmployee, isEmployeeLoading } = useEmployee();
    const navigate = useNavigate();

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
            ? "bg-primary-500 text-white"
            : "text-neutral-700 hover:bg-primary-50 dark:text-neutral-300 dark:hover:bg-dark-primary-900/10"
        }`;

    const DashboardSidebar = () => (
        <Card
            color="transparent"
            shadow={false}
            className="h-full w-full overflow-y-auto bg-neutral-100 dark:bg-dark-neutral-100 border-r rounded-none border-neutral-200 dark:border-dark-neutral-300 lg:py-10"
        >
            {/* User Profile Section */}
            <div className="mb-6 flex items-center gap-4 p-4 bg-primary-50 dark:bg-dark-primary-900/20">
                <div className="flex items-center justify-center h-12 w-12">
                    <img
                        src={user?.photoURL}
                        className="h-12 w-12 rounded-full object-cover object-center"
                        alt="User Profile"
                    />
                </div>
                <div>
                    <Typography variant="h6" color="blue-gray" className="dark:text-white">
                        {user?.displayName || 'Dashboard User'}
                    </Typography>
                    <Typography variant="small" color="gray" className="dark:text-neutral-400">
                        {user?.email}
                    </Typography>
                </div>
            </div>

            <List className="space-y-1">
                {/* Dashboard Navigation Links */}
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
                            className={NavLinkStyle}
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            All Employee List
                        </NavLink>
                        <NavLink
                            to="/dashboard/payroll"
                            className={NavLinkStyle}
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
                            className={NavLinkStyle}
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Employee List
                        </NavLink>
                        <NavLink
                            to="/dashboard/progress"
                            className={NavLinkStyle}
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Progress
                        </NavLink>
                        <NavLink
                            to="/dashboard/payment_history"
                            className={NavLinkStyle}
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
                            className={NavLinkStyle}
                            onClick={closeDrawer}
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            My Work-Sheet
                        </NavLink>
                        <NavLink
                            to="/dashboard/payment-history"
                            className={NavLinkStyle}
                            onClick={closeDrawer}
                        >
                            <ListItemPrefix>
                                <InboxIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            Payment History
                        </NavLink>
                    </>
                )}

                {/* Logout Link */}
                <ListItem
                    onClick={handleLogout}
                    className="cursor-pointer px-4 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
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
        <div className="flex flex-col min-h-screen">
            <NavbarDefault />

            <div className="flex flex-1 relative">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-[20%] min-h-screen">
                    <DashboardSidebar />
                </div>

                {/* Mobile Sidebar Toggle */}
                <div className="md:hidden fixed bottom-4 right-4 z-[9]">
                    <Button
                        onClick={openDrawer}
                        variant="gradient"
                        className="bg-primary-500 hover:bg-primary-600 rounded-full p-3 shadow-lg"
                    >
                        {isDrawerOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>

                {/* Mobile Drawer Sidebar */}
                <Drawer
                    open={isDrawerOpen}
                    onClose={closeDrawer}
                    placement="left"
                    className="md:hidden fixed top-14 bottom-0 z-[9998] w-64"
                    overlayProps={{
                        className: "fixed inset-0 z-[10] bg-black/40 backdrop-blur-sm",
                        style: { position: 'fixed' }
                    }}
                    containerProps={{
                        className: "fixed top-16 bottom-0 left-0 z-[0] w-64"
                    }}
                >
                    <DashboardSidebar />
                </Drawer>

                {/* Main Content Area */}
                <div className="flex-1 bg-white dark:bg-dark-background md:p-6">
                    <Outlet />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DashboardLayout;