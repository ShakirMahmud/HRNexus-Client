
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';


const PrivateRoute = ({children}) => {
    const { user, loading} = useAuth();
    const location = useLocation();
    if(loading){
        return <LoadingSpinner/>
    }
    if(user && user?.email){
        return children;
    }
    return <Navigate state={location.pathname} to={'/login'}></Navigate>
};

export default PrivateRoute;