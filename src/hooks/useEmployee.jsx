
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useEmployee = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: isEmployee, refetch, isLoading: isEmployeeLoading } = useQuery({
        queryKey: ['employee', user?.email],
        enabled: !loading,
        queryFn: async () => {
            if (user?.email) {
                const res = await axiosSecure.get(`/users/employee/${user?.email}`);
                // console.log('employee', res.data);
                return res.data?.isEmployee;
            } else {
                return false;
            }
        }
    })
    return {isEmployee, refetch, isEmployeeLoading};
};

export default useEmployee;