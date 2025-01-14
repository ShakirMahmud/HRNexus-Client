import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import useEmployee from "../hooks/useEmployee";


const EmployeeRoute = ({children}) => {
    const { user, loading } = useAuth();
    const { isEmployee, isEmployeeLoading } = useEmployee();
    
    const location = useLocation();
    if(loading || isEmployeeLoading ){
        return <LoadingSpinner/>
    }
    if(user && user?.email && isEmployee ){
        return children;
    }
    return <Navigate state={location.pathname} to={'/'}></Navigate>
};

export default EmployeeRoute;