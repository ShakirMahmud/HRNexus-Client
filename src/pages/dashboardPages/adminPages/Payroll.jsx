import React, { useState } from 'react';
import {
    Card,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
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
                <Typography>Loading payments...</Typography>
            </div>
        );
    }

    return (
        <Card className="w-full overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Employee Name
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Employee Email
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Salary
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Period
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Status
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Payment Date
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100 text-center">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Actions
                            </Typography>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => {
                        const isPending = payment.status === 'pending';
                        const isProcessing = processingPayment === payment._id;

                        return (
                            <tr key={payment._id} className="hover:bg-blue-gray-50">
                                <td className="p-4 border-b border-blue-gray-50">
                                    <Typography variant="small" color="blue-gray">
                                        {payment.employeeName}
                                    </Typography>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <Typography variant="small" color="blue-gray">
                                        {payment.employeeEmail}
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
                                        {getMonthName(payment.month)} {payment.year}
                                    </Typography>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <Chip
                                        variant="ghost"
                                        size="sm"
                                        value={payment.status}
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
                                            : 'Not Paid'}
                                    </Typography>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50 text-center">
                                    <Button
                                        size="sm"
                                        color="green"
                                        disabled={!isPending || isProcessing}
                                        onClick={() => handlePayEmployee(payment)}
                                    >
                                        {isProcessing ? 'Processing...' : 'Pay'}
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Card>
    );
};

export default Payroll;