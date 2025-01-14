
import useAdmin from "../../hooks/useAdmin";
import useHR from "../../hooks/useHR";

const Test = () => {
    const {isAdmin, isAdminLoading} = useAdmin();
    const {isHR, isHRLoading} = useHR();

    if(isAdminLoading || isHRLoading){
        return <h1>Loading...</h1>
    }

    return (
        <div>
            {
                isAdmin && <h1 className="text-7xl text-red-500">You are admin</h1>
            }
            {
                isHR && <h1 className="text-7xl text-red-500">You are HR</h1>
            }
            {
                !isAdmin && !isHR && <h1 className="text-7xl text-red-500">You are Employee</h1>
            }
        </div>
    );
};

export default Test;