import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import HRStats from "./HRStats";

const HRStatsDashboard = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: hrStats = {},
        isLoading,
        error
    } = useQuery({
        queryKey: ['hrStats'],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get('/stats/hr');
                return res.data;
            } catch (err) {
                console.error('Error fetching HR stats:', err);
                throw err;
            }
        },
        // Add retry and error handling
        retry: 1,
        refetchOnWindowFocus: false
    });

    return (
        <HRStats
            hrStats={hrStats}
            isLoading={isLoading}
            error={error}
        />
    );
};

export default HRStatsDashboard;