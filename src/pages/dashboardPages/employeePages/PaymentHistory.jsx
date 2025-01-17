import React, { useState, useMemo } from 'react';
import {
    Card,
    Typography,
    Chip,
    Pagination,
    Alert
} from "@material-tailwind/react";
import {
    CalendarIcon,
    DollarSignIcon,
    ClockIcon,
    CheckCircleIcon
} from 'lucide-react';
import useAuth from "../../../hooks/useAuth";
import usePayment from "../../../hooks/usePayment";

const PaymentHistory = () => {
    const { user } = useAuth();
    const { payments, paymentLoading } = usePayment(user?.email);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Group payments by year and month
    const groupedPayments = useMemo(() => {
        if (!payments) return {};
        
        const grouped = payments.reduce((acc, payment) => {
            const key = `${payment.year}-${payment.month}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(payment);
            return acc;
        }, {});

        // Sort grouped payments by year and month (earliest first)
        return Object.entries(grouped)
            .sort(([a], [b]) => {
                const [aYear, aMonth] = a.split('-').map(Number);
                const [bYear, bMonth] = b.split('-').map(Number);
                return aYear - bYear || aMonth - bMonth;
            })
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
    }, [payments]);

    // Pagination logic
    const sortedGroupKeys = Object.keys(groupedPayments);
    const paginatedKeys = sortedGroupKeys.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    // Month name converter
    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    };

    // Render content
    const renderContent = () => {
        // Loading state
        if (paymentLoading) {
            return (
                <tr>
                    <td colSpan="5" className="text-center py-4">
                        <Typography>Loading payment history...</Typography>
                    </td>
                </tr>
            );
        }

        // No payments
        if (!payments || payments.length === 0) {
            return (
                <tr>
                    <td colSpan="5">
                        <Alert color="blue" className="text-center">
                            No payment history available.
                        </Alert>
                    </td>
                </tr>
            );
        }

        // Render grouped payments
        return paginatedKeys.map((key) => {
            const [year, month] = key.split('-').map(Number);
            const monthPayments = groupedPayments[key];

            return (
                <React.Fragment key={key}>
                    <tr className="bg-blue-gray-50">
                        <td colSpan="5" className="p-3">
                            <Typography variant="small" color="blue-gray" className="font-bold flex items-center">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {getMonthName(month)} {year}
                            </Typography>
                        </td>
                    </tr>
                    {monthPayments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-blue-gray-50">
                            <td className="p-4 border-b border-blue-gray-50">
                                <Typography variant="small" color="blue-gray">
                                    {getMonthName(payment.month)} {payment.year}
                                </Typography>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Typography 
                                    variant="small" 
                                    color="green" 
                                    className="font-bold flex items-center"
                                >
                                    <DollarSignIcon className="h-4 w-4 mr-1" />
                                    {payment.amount}
                                </Typography>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Typography variant="small" color="blue-gray">
                                    {payment.transactionId}
                                </Typography>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Chip
                                    variant="ghost"
                                    size="sm"
                                    value={payment.status}
                                    icon={
                                        payment.status === 'pending' 
                                            ? <ClockIcon className="h-4 w-4" /> 
                                            : <CheckCircleIcon className="h-4 w-4" />
                                    }
                                    color={
                                        payment.status === 'pending' ? 'yellow' : 
                                        payment.status === 'completed' ? 'green' : 'red'
                                    }
                                />
                            </td>
                            <td className="p-4 border-b border-blue-gray-50">
                                <Typography variant="small" color="blue-gray">
                                    {payment.paymentDate 
                                        ? new Date(payment.paymentDate).toLocaleDateString() 
                                        : 'N/A'}
                                </Typography>
                            </td>
                        </tr>
                    ))}
                </React.Fragment>
            );
        });
    };

    return (
        <Card className="w-full overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Period
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Amount
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Transaction ID
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Status
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Paid Date
                            </Typography>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {renderContent()}
                </tbody>
            </table>

            {payments && payments.length > itemsPerPage && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        color="blue"
                        total={Math.ceil(sortedGroupKeys.length / itemsPerPage)}
                        current={currentPage}
                        onChange={setCurrentPage}
                    />
                </div>
            )}
        </Card>
    );
};

export default PaymentHistory;