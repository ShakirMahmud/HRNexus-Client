
import LoadingSpinner from "../../components/LoadingSpinner";
import useAdmin from "../../hooks/useAdmin";
import useAuth from "../../hooks/useAuth";
import useEmployee from "../../hooks/useEmployee";
import useHR from "../../hooks/useHR";

const Test = () => {
    const {isAdmin, isAdminLoading} = useAdmin();
    const {isHR, isHRLoading} = useHR();
    const {isEmployee, isEmployeeLoading} = useEmployee();
    const {user, loading} = useAuth();

    if(isAdminLoading || isHRLoading || isEmployeeLoading || loading){
        return <LoadingSpinner/>
    }

    return (
        <div>
            {
                isAdmin && <h1 className="text-7xl text-red-500">You are admin. {user?.email}</h1>
            }
            {
                isHR && <h1 className="text-7xl text-red-500">You are HR. {user?.email}</h1>
            }
            {
                isEmployee && <h1 className="text-7xl text-red-500">You are Employee. {user?.email}</h1>
            }
        </div>
    );
};

export default Test;