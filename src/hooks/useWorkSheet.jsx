import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';
import useHR from './useHR';
import useEmployee from './useEmployee';
const useWorkSheet = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { isHr } = useHR();
    const { isEmployee } = useEmployee();

    const { data: workSheet = [], isLoading: workSheetLoading, refetch } = useQuery({
        queryKey: ['workSheet', user?.email, isEmployee],
        queryFn: async () => {
            const res = await axiosSecure.get(
                isEmployee ? `/workSheet/${user?.email}` : `/workSheet`
            );
            return Array.isArray(res.data) ? res.data : [res.data];
        },
        enabled: !!user
    });
    return { workSheet, workSheetLoading, refetch };

};

export default useWorkSheet;