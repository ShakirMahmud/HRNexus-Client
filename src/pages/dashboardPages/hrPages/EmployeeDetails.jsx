import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { 
    Card, 
    CardHeader, 
    Typography, 
    Avatar 
} from "@material-tailwind/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
        return <div>No employee data available</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <Card className="w-full max-w-4xl mx-auto">
                {/* Employee Profile Header */}
                <CardHeader 
                    floated={false} 
                    shadow={false} 
                    className="flex items-center gap-4 p-6 bg-blue-gray-50"
                >
                    <Avatar 
                        src={employee.image || employee.photoURL} 
                        alt={employee.name} 
                        size="xl" 
                    />
                    <div>
                        <Typography variant="h4">{employee.name}</Typography>
                        <Typography variant="paragraph" color="blue-gray">
                            {employee.email}
                        </Typography>
                        <Typography variant="small" color="gray">
                            Designation: {employee.designation || 'Not Assigned'}
                        </Typography>
                    </div>
                </CardHeader>

                {/* Payment History Chart */}
                <div className="p-6">
                    <Typography variant="h5" className="mb-4">
                        Salary Payment History
                    </Typography>
                    
                    {isLoading ? (
                        <div>Loading payment history...</div>
                    ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="name" 
                                    label={{ 
                                        value: 'Month/Year', 
                                        position: 'insideBottom', 
                                        offset: -5 
                                    }} 
                                />
                                <YAxis 
                                    label={{ 
                                        value: 'Salary ($)', 
                                        angle: -90, 
                                        position: 'insideLeft' 
                                    }} 
                                />
                                <Tooltip 
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-4 border rounded shadow">
                                                    <p>Month/Year: {data.name}</p>
                                                    <p>Salary: ${data.salary}</p>
                                                    <p>Transaction ID: {data.transactionId}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="salary" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <Typography color="gray">
                            No payment history available
                        </Typography>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default EmployeeDetails;