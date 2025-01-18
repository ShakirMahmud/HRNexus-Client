import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { 
    Card, 
    CardHeader, 
    Typography, 
    Avatar 
} from "@material-tailwind/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const EmployeeDetails = () => {
    const location = useLocation();
    const employee = location.state?.employee;
    const axiosSecure = useAxiosSecure();

    const { data: paymentHistory = [], isLoading } = useQuery({
        queryKey: ['employee-payment-history', employee?.email],
        queryFn: async () => {
            if (!employee?.email) return [];
            
            const response = await axiosSecure.get(`/payments/${employee.email}`);
            return response.data;
        },
        enabled: !!employee?.email
    });

    // Transform payment data for chart
    const chartData = useMemo(() => {
        return paymentHistory.map(payment => ({
            name: `${payment.month}/${payment.year}`,
            salary: payment.amount,
            transactionId: payment.transactionId
        }));
    }, [paymentHistory]);

    if (!employee) {
        return (
            <div className="text-center py-6 text-neutral-700 dark:text-neutral-300">
                No employee data available
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-white dark:bg-dark-neutral-50 min-h-screen">
            <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-dark-neutral-100 shadow-lg dark:shadow-dark-elevated">
                {/* Employee Profile Header */}
                <CardHeader 
                    floated={false} 
                    shadow={false} 
                    className="flex items-center gap-4 p-6 bg-neutral-50 dark:bg-dark-neutral-200"
                >
                    <Avatar 
                        src={employee.image || employee.photoURL} 
                        alt={employee.name} 
                        size="xl" 
                        className="border-2 border-primary-500 dark:border-dark-primary-500"
                    />
                    <div>
                        <Typography 
                            variant="h4" 
                            className="font-semibold text-neutral-800 dark:text-neutral-100"
                        >
                            {employee.name}
                        </Typography>
                        <Typography 
                            variant="paragraph" 
                            className="text-neutral-600 dark:text-neutral-400"
                        >
                            {employee.email}
                        </Typography>
                        <Typography 
                            variant="small" 
                            className="text-neutral-500 dark:text-neutral-300"
                        >
                            Designation: {employee.designation || 'Not Assigned'}
                        </Typography>
                    </div>
                </CardHeader>

                {/* Payment History Chart */}
                <div className="p-6">
                    <Typography 
                        variant="h5" 
                        className="mb-4 font-semibold text-neutral-800 dark:text-neutral-100"
                    >
                        Salary Payment History
                    </Typography>
                    
                    {isLoading ? (
                        <div className="text-center text-neutral-600 dark:text-neutral-300">
                            Loading payment history...
                        </div>
                    ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="rgba(0,0,0,0.1)" 
                                    className="dark:stroke-dark-neutral-300"
                                />
                                <XAxis 
                                    dataKey="name" 
                                    label={{ 
                                        value: 'Month/Year', 
                                        position: 'insideBottom', 
                                        offset: -5 
                                    }} 
                                    tick={{ fill: 'currentColor' }}
                                    className="text-neutral-700 dark:text-neutral-300"
                                />
                                <YAxis 
                                    label={{ 
                                        value: 'Salary ($)', 
                                        angle: -90, 
                                        position: 'insideLeft' 
                                    }} 
                                    tick={{ fill: 'currentColor' }}
                                    className="text-neutral-700 dark:text-neutral-300"
                                />
                                <Tooltip 
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white dark:bg-dark-surface p-4 border border-neutral-200 dark:border-dark-neutral-300 rounded shadow-lg">
                                                    <p className="text-neutral-800 dark:text-neutral-100">Month/Year: {data.name}</p>
                                                    <p className="text-neutral-700 dark:text-neutral-300">Salary: ${data.salary}</p>
                                                    <p className="text-neutral-600 dark:text-neutral-400">Transaction ID: {data.transactionId}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="salary" 
                                    fill="#8884d8" 
                                    className="dark:fill-dark-primary-500"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Typography 
                            className="text-center text-neutral-600 dark:text-neutral-300"
                        >
                            No payment history available
                        </Typography>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default EmployeeDetails;