import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import AdminStats from './AdminStats';
import LoadingSpinner from '../../../components/LoadingSpinner';

const AdminStatsDashboard = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch Admin Stats
    const { 
        data: adminStats = {}, 
        isLoading: adminStatsLoading 
    } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/stats/admin');
            return res.data;
        }
    });

    // Fetch Contact Messages
    const { 
        data: contact = [], 
        isLoading: contactLoading 
    } = useQuery({
        queryKey: ['contact'],
        queryFn: async () => {
            const res = await axiosSecure.get('/contact');
            return res.data;
        }
    });

    // Loading State
    if (adminStatsLoading || contactLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoadingSpinner className="h-12 w-12 text-primary-500" />
            </div>
        );
    }

    return <AdminStats adminStats={adminStats} contact={contact} />;
};

export default AdminStatsDashboard;