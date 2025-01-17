import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const usePayment = () => {
    const axiosSecure = useAxiosSecure();
    const {data: payments = [], isLoading: paymentLoading, refetch: paymentRefetch} = useQuery({
        queryKey: ['payments'],
        queryFn: async () => {
            const res = await axiosSecure.get('/payments');
            return res.data;
        }
    })

    return {payments, paymentLoading, paymentRefetch};
};

export default usePayment;