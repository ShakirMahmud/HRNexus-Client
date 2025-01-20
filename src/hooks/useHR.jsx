import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useHR = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: isHR, refetch: refetchHR, isLoading: isHRLoading } = useQuery({
        queryKey: ['hr', user?.email],
        enabled: !loading,
        queryFn: async () => {
            if (user?.email) {
                const res = await axiosSecure.get(`/users/hr/${user?.email}`);
                return res.data?.isHR;
            } else {
                return false;
            }
        }
    })
    return {isHR, refetchHR, isHRLoading};
};

export default useHR;