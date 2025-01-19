import React, { useState } from 'react';
import {
    Card,
    Typography,
    Button,
    Chip,
} from "@material-tailwind/react";
import {
    DollarSignIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon
} from 'lucide-react';
import usePayment from "../../../hooks/usePayment";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from 'sweetalert2';

const Payroll = () => {
    const { payments, paymentLoading, paymentRefetch } = usePayment();
    const axiosSecure = useAxiosSecure();
    const [processingPayment, setProcessingPayment] = useState(null);

    const handlePayEmployee = async (payment) => {
        try {
            // Confirm payment
            const result = await Swal.fire({
                title: 'Confirm Payment',
                html: `
                    <p>Pay <strong>${payment.employeeName}</strong></p>
                    <p>Amount: $${payment.amount}</p>
                    <p>Month: ${payment.month}/${payment.year}</p>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Process Payment'
            });

            if (!result.isConfirmed) return;

            // Set processing state
            setProcessingPayment(payment._id);

            const updatedPayment = { status: 'completed', paymentDate: new Date().toISOString() };
            // API call to process payment
            const response = await axiosSecure.put(`/payments/${payment._id}`, updatedPayment);

            if (response.data.modifiedCount > 0) {
                // Success notification
                await Swal.fire({
                    icon: 'success',
                    title: 'Payment Processed',
                    text: `Successfully paid ${payment.employeeName}`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });

                // Refresh payments
                paymentRefetch();
            } else {
                throw new Error('Payment processing failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: error.message || 'Unable to process payment'
            });
        } finally {
            // Reset processing state
            setProcessingPayment(null);
        }
    };

    // Determine month name
    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    };

    if (paymentLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Typography className="text-neutral-700 dark:text-neutral-300">
                    Loading payments...
                </Typography>
            </div>
        );
    }

    return (
        <Card className="w-full bg-white dark:bg-dark-surface shadow-sm">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="bg-neutral-50 dark:bg-dark-neutral-200">
                            {['Employee Name', 'Employee Email', 'Salary', 'Period', 'Status', 'Payment Date', 'Actions'].map((head) => (
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
                        {payments.map((payment) => {
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
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Typography
                                            variant="small"
                                            className="text-neutral-800 dark:text-neutral-100"
                                        >
                                            {getMonthName(payment.month)} {payment.year}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
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
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Typography
                                            variant="small"
                                            className="text-neutral-800 dark:text-neutral-100"
                                        >
                                            {payment.paymentDate
                                                ? new Date(payment.paymentDate).toLocaleDateString()
                                                : 'Not Paid'}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 text-center">
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

            {/* Mobile View */}
            <div className="md:hidden">
                {payments.map((payment) => {
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
                                <div className='flex flex-col  items-end'>
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
                                <div>
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
                                <div className='flex flex-col  items-end'>
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
                            </div>
                            <div className="flex justify-end">
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

            {/* No Payments State */}
            {(!payments || payments.length === 0) && (
                <div className="text-center py-6">
                    <Typography
                        variant="h6"
                        className="text-neutral-600 dark:text-neutral-300"
                    >
                        No payment records found
                    </Typography>
                </div>
            )}
        </Card>
    );
};

export default Payroll;