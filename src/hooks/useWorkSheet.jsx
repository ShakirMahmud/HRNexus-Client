
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

    let link = ``;

    if (isEmployee) {
        link = `/workSheet/${user?.email}`;
    }

    if (isHr) {
        link = `/workSheet`;
    }

    const { data: workSheet, isLoading: workSheetLoading, refetch } = useQuery({
        queryKey: ['workSheet'],
        queryFn: async () => {
            const res = await axiosSecure.get(link);
            return res.data;
        },
        enabled: !!user
    });

    return { workSheet, workSheetLoading, refetch };

};

export default useWorkSheet;