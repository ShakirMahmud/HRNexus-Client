import React, { useMemo } from 'react';
import {
    DollarSignIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon
} from 'lucide-react';
import {
    Card,
    Typography,
    Button,
    Chip,
} from "@material-tailwind/react";

const PayrollMobileView = ({ 
    payments, 
    processingPayment, 
    setProcessingPayment, 
    paymentRefetch, 
    getMonthName,
    handlePayEmployee 
}) => {
    // Group payments by year and month, sorted with latest first
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
        <div className="md:hidden">
            {groupedPayments.map(([key, monthPayments]) => {
                const [year, month] = key.split('-').map(Number);
                return (
                    <div key={key} className="mb-6">
                        {/* Month Header */}
                        <div className="bg-neutral-100 dark:bg-dark-neutral-200 p-3 rounded-t-lg mb-2">
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

                        {/* Payments for this month */}
                        {monthPayments.map((payment) => {
                            const isPending = payment.status === 'pending';
                            const isProcessing = processingPayment === payment._id;

                            return (
                                <Card
                                    key={payment._id}
                                    className="mb-4 p-4 bg-white dark:bg-dark-neutral-200"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <Typography
                                            variant="small"
                                            className="font-bold text-neutral-800 dark:text-neutral-100"
                                        >
                                            {payment.employeeName}
                                        </Typography>
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
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div>
                                            <Typography
                                                variant="small"
                                                className="text-neutral-600 dark:text-neutral-400 font-medium"
                                            >
                                                Email
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="text-neutral-800 dark:text-neutral-100"
                                            >
                                                {payment.employeeEmail}
                                            </Typography>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <Typography
                                                variant="small"
                                                className="text-neutral-600 dark:text-neutral-400 font-medium"
                                            >
                                                Salary
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="font-bold text-success-600 dark:text-success-400 flex items-center"
                                            >
                                                <DollarSignIcon className="h-4 w-4 mr-1" />
                                                {payment.amount}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <div>
                                            <Typography
                                                variant="small"
                                                className="text-neutral-600 dark:text-neutral-400 font-medium"
                                            >
                                                Payment Date
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="text-neutral-800 dark:text-neutral-100"
                                            >
                                                {payment.paymentDate
                                                    ? new Date(payment.paymentDate).toLocaleDateString()
                                                    : 'Not Paid'}
                                            </Typography>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <Typography
                                                variant="small"
                                                className="text-neutral-600 dark:text-neutral-400 font-medium"
                                            >
                                                Period
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="text-neutral-800 dark:text-neutral-100"
                                            >
                                                {getMonthName(payment.month)} {payment.year}
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            size="sm"
                                            color="green"
                                            disabled={!isPending || isProcessing}
                                            onClick={() => handlePayEmployee(payment)}
                                            className="dark:bg-success-600 dark:hover:bg-success-500 dark:text-white"
                                        >
                                            {isProcessing ? 'Processing...' : 'Pay'}
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                );
            })}

            {/* No Payments State */}
            {groupedPayments.length === 0 && (
                <div className="text-center py-6">
                    <Typography
                        variant="h6"
                        className="text-neutral-600 dark:text-neutral-300"
                    >
                        No payment records found
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default PayrollMobileView;