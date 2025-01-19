
import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import Home from "../pages/homePages/Home";
import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/authPages/Login";
import Register from "../pages/authPages/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import EmployeeRoute from "./EmployeeRoute";
import WorkSheet from "../pages/dashboardPages/employeePages/WorkSheet";
import HRRoute from "./HRRoute";
import EmployeeList from "../pages/dashboardPages/hrPages/EmployeeList";
import EmployeeDetails from "../pages/dashboardPages/hrPages/EmployeeDetails";
import Progress from "../pages/dashboardPages/hrPages/Progress";
import AdminRoute from './AdminRoute';
import AllEmployeeList from "../pages/dashboardPages/adminPages/AllEmployeeList";
import Payroll from "../pages/dashboardPages/adminPages/Payroll";
import PaymentHistory from "../pages/dashboardPages/employeePages/PaymentHistory";
import ContactUs from "../pages/contactPage/ContactUs";
import AdminStats from "../pages/dashboardPages/adminPages/AdminStats";
import HRStats from "../pages/dashboardPages/hrPages/HRStats";
import EmployeeStats from "../pages/dashboardPages/employeePages/EmployeeStats";
import AdminStatsDashboard from "../pages/dashboardPages/adminPages/AdminStatsDashboard";
import HRStatsDashboard from "../pages/dashboardPages/hrPages/HRStatsDashboard";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: 'contact',
                element: <ContactUs/>
            },
            {},
            {},
            {
                path: 'login',
                element: <Login/>
            },
            {
                path: 'register',
                element: <Register/>
            },
        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoute><DashboardLayout/></PrivateRoute>,
        children:[
            // employee routes 
            {
                path: 'employee',
                element: <EmployeeRoute><EmployeeStats/></EmployeeRoute>
            },
            {
                path: 'work-sheet',
                element: <EmployeeRoute><WorkSheet/></EmployeeRoute>
            },
            {
                path: 'payment-history',
                element: <EmployeeRoute><PaymentHistory/></EmployeeRoute>
            },
            {},
            {},
            // hr routes
            {
                path: 'hr',
                element: <HRRoute><HRStatsDashboard/></HRRoute>
            },
            {
                path: 'employee-list',
                element: <HRRoute><EmployeeList/></HRRoute>
            },
            {
                path: 'employee-details/:id',
                element: <HRRoute><EmployeeDetails/></HRRoute>
            },
            {
                path: 'progress',
                element: <HRRoute><Progress/></HRRoute>
            },
            {
                path: 'payment_history',
                element: <HRRoute><PaymentHistory/></HRRoute>
            },
            // admin routes
            {
                path: 'admin',
                element: <AdminRoute><AdminStatsDashboard/></AdminRoute>
            },
            {
                path: 'all-employee-list',
                element: <AdminRoute><AllEmployeeList/></AdminRoute>
            },
            {
                path: 'payroll',
                element: <AdminRoute><Payroll/></AdminRoute>
            },
            {},
            {},
        ]
    }
])