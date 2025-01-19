import React, { useState } from 'react';
import {
    Card,
    Typography,
    Button,
    Chip,
} from "@material-tailwind/react";

import usePayment from "../../../hooks/usePayment";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from 'sweetalert2';
import PayrollDesktopView from './PayrollDesktopView';
import PayrollMobileView from './PayrollMobileView';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutModal from '../hrPages/CheckoutModal';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_Key);
const Payroll = () => {
    const { payments, paymentLoading, paymentRefetch } = usePayment();
    const axiosSecure = useAxiosSecure();
    const [processingPayment, setProcessingPayment] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    const handlePayEmploye = async (payment) => {
        console.log(payment);
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

    const handlePayEmployee = (payment) => {
        console.log(payment);

        console.log('Selected payment:', payment);
        setSelectedPayment(payment);
        setIsCheckoutModalOpen(true);
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
            <PayrollDesktopView
                payments={payments}
                processingPayment={processingPayment}
                setProcessingPayment={setProcessingPayment}
                paymentRefetch={paymentRefetch}
                getMonthName={getMonthName}
                handlePayEmployee={handlePayEmployee}
            />

            {/* Mobile View */}
            <PayrollMobileView
                payments={payments}
                processingPayment={processingPayment}
                setProcessingPayment={setProcessingPayment}
                paymentRefetch={paymentRefetch}
                getMonthName={getMonthName}
            />

            {isCheckoutModalOpen && (
                <Elements stripe={stripePromise}>
                    <CheckoutModal
                        employee={selectedPayment}
                        isOpen={isCheckoutModalOpen}
                        onClose={() => setIsCheckoutModalOpen(false)}
                    />
                </Elements>
            )}

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