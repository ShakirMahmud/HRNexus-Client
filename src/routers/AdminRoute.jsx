import { Navigate, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";


const AdminRoute = ({children}) => {
    const { user, loading } = useAuth();
    const {isAdmin, isAdminLoading} = useAdmin();
    const location = useLocation();
    if(loading || isAdminLoading){
        return <LoadingSpinner/>
    }
    if(user && user?.email && isAdmin){
        return children;
    }
    return <Navigate state={location.pathname} to={'/'}></Navigate>
};

export default AdminRoute;