import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const usePayment = (email) => {
    const axiosSecure = useAxiosSecure();
    
    const {data: payments = [], isLoading: paymentLoading, refetch: paymentRefetch} = useQuery({
        queryKey: ['payments'],
        queryFn: async () => {
            const res = await axiosSecure.get(
                email ? `/payments/${email}` : `/payments`
            );
            return res.data;
        }
    })

    return {payments, paymentLoading, paymentRefetch};
};

export default usePayment;