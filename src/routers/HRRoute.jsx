import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";
import useHR from "../hooks/useHR";

const HRRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { isHR, isHRLoading } = useHR();
    const location = useLocation();
    if (loading || isHRLoading) {
        return <LoadingSpinner />
    }
    if (user && user?.email && isHR) {
        return children;
    }
    return <Navigate state={location.pathname} to={'/'}></Navigate>
};

export default HRRoute;