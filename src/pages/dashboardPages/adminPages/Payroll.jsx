import React, { useState } from 'react';
import {
    Card,
    Typography,
    Button,
    Chip,
} from "@material-tailwind/react";

import usePayment from "../../../hooks/usePayment";
import PayrollDesktopView from './PayrollDesktopView';
import PayrollMobileView from './PayrollMobileView';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutModal from '../hrPages/CheckoutModal';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_Key);
const Payroll = () => {
    const { payments, paymentLoading, paymentRefetch } = usePayment();
    const [processingPayment, setProcessingPayment] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

    const handlePayEmployee = (payment) => {
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
            <div className="hidden md:block">
                <PayrollDesktopView
                    payments={payments}
                    processingPayment={processingPayment}
                    setProcessingPayment={setProcessingPayment}
                    paymentRefetch={paymentRefetch}
                    getMonthName={getMonthName}
                    handlePayEmployee={handlePayEmployee}
                />
            </div>

            {/* Mobile View - Visible only on mobile */}
            <div className="block md:hidden">
                <PayrollMobileView
                    payments={payments}
                    processingPayment={processingPayment}
                    setProcessingPayment={setProcessingPayment}
                    paymentRefetch={paymentRefetch}
                    getMonthName={getMonthName}
                />
            </div>

            {isCheckoutModalOpen && (
                <Elements stripe={stripePromise}>
                    <CheckoutModal
                        employee={selectedPayment}
                        isOpen={isCheckoutModalOpen}
                        onClose={() => setIsCheckoutModalOpen(false)}
                        paymentRefetch={paymentRefetch}
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