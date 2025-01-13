import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";


const useAuth = () => {
    const userContext = useContext(AuthContext);
    return userContext;
}

export default useAuth