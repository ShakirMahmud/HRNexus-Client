import React, { useMemo } from 'react';
import { DollarSignIcon } from "lucide-react";
import {
    Card,
    Typography,
    Button,
    Chip
} from "@material-tailwind/react";

const PayrollDesktopView = ({ 
    payments, 
    processingPayment, 
    getMonthName, 
    handlePayEmployee 
}) => {
    const groupedPayments = useMemo(() => {
        const grouped = {};
        payments.forEach(payment => {
            const key = `${payment.year}-${payment.month}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(payment);
        });

        return Object.entries(grouped)
            .sort(([a], [b]) => {
                const [yearA, monthA] = a.split('-').map(Number);
                const [yearB, monthB] = b.split('-').map(Number);
                return yearB - yearA || monthB - monthA;
            });
    }, [payments]);

    return (
        <div className="h-screen overflow-auto p-4">
            {groupedPayments.length === 0 ? (
                <div className="text-center text-neutral-600 dark:text-neutral-300">
                    No payment records found
                </div>
            ) : (
                groupedPayments.map(([key, monthPayments]) => {
                    const [year, month] = key.split('-').map(Number);
                    return (
                        <div key={key} className="mb-6">
                            <div className="bg-neutral-100 dark:bg-dark-neutral-200 p-3 rounded-t-lg">
                                <Typography 
                                    variant="h6" 
                                    className="text-neutral-800 dark:text-neutral-100 flex items-center"
                                >
                                    {getMonthName(month)} {year}
                                    <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
                                        ({monthPayments.length} payments)
                                    </span>
                                </Typography>
                            </div>
                            <table className="w-full min-w-max table-auto text-left border-collapse">
                                <thead>
                                    <tr className="bg-neutral-50 dark:bg-dark-neutral-100">
                                        {['Employee Name', 'Employee Email', 'Salary', 'Status', 'Payment Date', 'Actions'].map((head) => (
                                            <th
                                                key={head}
                                                className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300"
                                            >
                                                <Typography
                                                    variant="small"
                                                    className="font-bold text-neutral-700 dark:text-neutral-300"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthPayments.map((payment) => {
                                        const isPending = payment.status === 'pending';
                                        const isProcessing = processingPayment === payment._id;

                                        return (
                                            <tr
                                                key={payment._id}
                                                className="hover:bg-neutral-50 dark:hover:bg-dark-neutral-300"
                                            >
                                                <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                                    <Typography
                                                        variant="small"
                                                        className="text-neutral-800 dark:text-neutral-100"
                                                    >
                                                        {payment.employeeName}
                                                    </Typography>
                                                </td>
                                                <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                                    <Typography
                                                        variant="small"
                                                        className="text-neutral-800 dark:text-neutral-100"
                                                    >
                                                        {payment.employeeEmail}
                                                    </Typography>
                                                </td>
                                                <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                                    <Typography
                                                        variant="small"
                                                        className="font-bold flex items-center text-success-600 dark:text-success-400"
                                                    >
                                                        <DollarSignIcon className="h-4 w-4 mr-1" />
                                                        {payment.amount}
                                                    </Typography>
                                                </td>
                                                <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-330">
                                                    <Chip
                                                        variant="ghost"
                                                        size="sm"
                                                        value={payment.status}
                                                        color={
                                                            payment.status === 'pending' ? 'yellow' :
                                                            payment.status === 'completed' ? 'green' : 'red'
                                                        }
                                                        className="dark:text-neutral-100"
                                                    />
                                                </td>
                                                <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-330">
                                                    <Typography
                                                        variant="small"
                                                        className="text-neutral-800 dark:text-neutral-100"
                                                    >
                                                        {payment.paymentDate
                                                            ? new Date(payment.paymentDate).toLocaleDateString()
                                                            : 'Not Paid'}
                                                    </Typography>
                                                </td>
                                                <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-330 text-center">
                                                    <Button
                                                        size="sm"
                                                        color="green"
                                                        disabled={!isPending || isProcessing}
                                                        onClick={() => handlePayEmployee(payment)}
                                                        className="dark:bg-success-600 dark:hover:bg-success-500 dark:text-white"
                                                    >
                                                        {isProcessing ? 'Processing...' : 'Pay'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default PayrollDesktopView;