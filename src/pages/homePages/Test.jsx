
import useAdmin from "../../hooks/useAdmin";

const Test = () => {
    const {isAdmin} = useAdmin();
    return (
        <div>
            {
                isAdmin && <h1 className="text-7xl text-red-500">You are admin</h1>
            }
        </div>
    );
};

export default Test;