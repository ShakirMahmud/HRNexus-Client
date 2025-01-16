import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { 
        data: users = [], 
        isLoading: isUsersLoading,
        refetch 
    } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            const employees = res.data.filter(user => user.roleValue === 'Employee');
            const hrs = res.data.filter(user => user.roleValue === 'HR');
            const hrsAndEmployees = [...employees, ...hrs];
            
            return {
                all: res.data,
                employees,
                hrs,
                hrsAndEmployees
            };
        }
    });

    return { 
        users: users.all || [], 
        employees: users.employees || [],
        hrs: users.hrs || [],
        hrsAndEmployees: users.hrsAndEmployees || [],
        isUsersLoading,
        refetch 
    };
};

export default useUsers;