import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Option,
    Select,
    Typography
} from "@material-tailwind/react";
import usePayment from "../../../hooks/usePayment";

const CheckoutModal = ({ employee, isOpen, onClose, paymentRefetch }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');

    // Create payment intent when modal opens and total salary is available
    useEffect(() => {
        if (isOpen && employee?.amount> 0) {
            axiosSecure.post('/payments/paymentIntent', {
                salary: employee.amount
            })
                .then(response => {
                    setClientSecret(response.data.clientSecret);
                })
                .catch(error => {
                    console.error("Error creating payment intent", error);
                    setError("Could not initialize payment");
                });
        }
    }, [isOpen, employee, axiosSecure]);

    const handlePayment = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            setError("Payment processing unavailable");
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            setError("Card details not found");
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            // Confirm card payment
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: card,
                        billing_details: {
                            name: employee.employeeName || 'Unknown',
                            email: employee.employeeEmail || 'Unknown'
                        }
                    }
                }
            );

            if (confirmError) {
                setError(confirmError.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // Prepare payment request
                const paymentRequest = {
                    transactionId: paymentIntent.id,
                    status: 'completed',
                    paymentDate: new Date().toISOString(),
                };

                // Submit payment request to backend
                await axiosSecure.put(`/payments/${employee._id}`, paymentRequest);
                paymentRefetch();
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: `Payment for ${employee.employeeName} has been processed successfully.`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });

                setProcessing(false);
                onClose();
            }
        } catch (error) {
            console.error("Payment error", error);
            setError("Payment processing failed");
            setProcessing(false);
        }
    };
    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    };

    return (
        <Dialog
            open={isOpen}
            handler={onClose}
            size="md"
            className="dark:bg-dark-surface"
        >
            <DialogHeader className="text-neutral-800 dark:text-neutral-100 border-b border-neutral-200 dark:border-dark-neutral-300">
                Salary Payment for {employee.employeeName}
            </DialogHeader>
            <DialogBody>
                <div className="grid gap-4">
                    <Typography className="text-neutral-800 dark:text-neutral-100">
                        Total Salary:
                        <span className="text-primary-600 dark:text-dark-primary-400 ml-2">
                            ${employee.amount}
                        </span>
                    </Typography>

                    {/* Month and Year Selection */}
                    <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                            <Typography
                                variant="small"
                                className="mb-2 text-neutral-600 dark:text-neutral-400"
                            >
                                Payment Month
                            </Typography>
                            <div className="p-3 bg-neutral-100 dark:bg-dark-neutral-200 rounded-lg">
                                <Typography
                                    variant="small"
                                    className="text-neutral-800 dark:text-neutral-100"
                                >
                                    {getMonthName(employee.month)}
                                </Typography>
                            </div>
                        </div>
                        <div>
                            <Typography
                                variant="small"
                                className="mb-2 text-neutral-600 dark:text-neutral-400"
                            >
                                Payment Year
                            </Typography>
                            <div className="p-3 bg-neutral-100 dark:bg-dark-neutral-200 rounded-lg">
                                <Typography
                                    variant="small"
                                    className="text-neutral-800 dark:text-neutral-100"
                                >
                                    {employee.year}
                                </Typography>
                            </div>
                        </div>
                    </div>

                    {/* Stripe Card Element */}
                    <div className="bg-neutral-100 dark:bg-dark-neutral-200 p-4 rounded-lg">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#757dbf',
                                        backgroundColor: 'transparent',
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <Typography
                            color="red"
                            variant="small"
                            className="mt-2 text-danger-500 dark:text-danger-400"
                        >
                            {error}
                        </Typography>
                    )}
                </div>
            </DialogBody>
            <DialogFooter className="border-t border-neutral-200 dark:border-dark-neutral-300">
                <Button
                    color="blue"
                    onClick={handlePayment}
                    disabled={processing || !stripe}
                    className="dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-white"
                >
                    {processing ? 'Processing...' : 'Pay Salary'}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default CheckoutModal;