
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: isAdmin, refetch: refetchAdmin, isLoading: isAdminLoading } = useQuery({
        queryKey: ['admin', user?.email],
        enabled: !loading,
        queryFn: async () => {
            if (user?.email) {
                const res = await axiosSecure.get(`/users/admin/${user?.email}`);
                // console.log('admin', res.data);
                return res.data?.isAdmin;
            } else {
                return false;
            }
        }
    })
    return {isAdmin, refetchAdmin, isAdminLoading};
};

export default useAdmin;