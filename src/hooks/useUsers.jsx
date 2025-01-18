import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

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
    const{ data: userByEmail, isLoading: userByEmailLoading, refetch: userByEmailRefetch } = useQuery({
        queryKey: ['userByEmail'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user?.email}`);
            return res.data;
        }
    });
        

    return { 
        users: users.all || [], 
        employees: users.employees || [],
        hrs: users.hrs || [],
        hrsAndEmployees: users.hrsAndEmployees || [],
        isUsersLoading,
        refetch,
        userByEmail,
        userByEmailLoading, 
        userByEmailRefetch
    };
};

export default useUsers;