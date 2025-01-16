
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
                element: <h1>Contact</h1>
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
                path: 'work-sheet',
                element: <EmployeeRoute><WorkSheet/></EmployeeRoute>
            },
            {},
            {},
            {},
            {},
            // hr routes
            {
                path: 'employee-list',
                element: <HRRoute><EmployeeList/></HRRoute>
            },
            {},
            {},
            {},
            {},
            // admin routes
            {},
            {},
            {},
            {},
            {},
        ]
    }
])