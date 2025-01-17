import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCreditCard, FaMoneyCheckAlt } from 'react-icons/fa';
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

const CheckoutModal = ({ employee, isOpen, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();

    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');

    // Create payment intent when modal opens and total salary is available
    useEffect(() => {
        if (isOpen && employee?.totalSalary > 0) {
            axiosSecure.post('/payments/paymentIntent', {
                salary: employee.totalSalary
            })
            .then(response => {
                console.log(response.data.clientSecret);
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
        setProcessing(true);

        // Validation checks
        if (!month || !year) {
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Information',
                text: 'Please provide both month and year'
            });
            setProcessing(false);
            return;
        }

        if (!stripe || !elements) {
            setProcessing(false);
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            setProcessing(false);
            return;
        }

        try {
            // Confirm card payment
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: card,
                        billing_details: {
                            name: employee.name || 'Unknown',
                            email: employee.email || 'Unknown'
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
                    employeeEmail: employee.email,
                    employeeName: employee.name,
                    month,
                    year,
                    amount: employee.totalSalary,
                    transactionId: paymentIntent.id,
                    status: 'pending'
                };

                // Submit payment request to backend
                await axiosSecure.post('/payments', paymentRequest);

                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: `Payment for ${employee.name} has been processed`
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

    return (
        <Dialog open={isOpen} handler={onClose} size="md">
            <DialogHeader>Salary Payment for {employee.name}</DialogHeader>
            <DialogBody>
                <div className="grid gap-4">
                    <Typography>
                        Total Salary: ${employee.totalSalary}
                    </Typography>

                    {/* Month and Year Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Payment Month"
                            value={month}
                            onChange={(value) => setMonth(value)}
                        >
                            {[...Array(12)].map((_, index) => (
                                <Option key={index + 1} value={index + 1}>
                                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            label="Payment Year"
                            value={year}
                            onChange={(value) => setYear(value)}
                        >
                            {[2023, 2024, 2025].map((yearOption) => (
                                <Option key={yearOption} value={yearOption}>
                                    {yearOption}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Stripe Card Element */}
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
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
                        <Typography color="red" variant="small">
                            {error}
                        </Typography>
                    )}
                </div>
            </DialogBody>
            <DialogFooter>
                <Button 
                    color="blue" 
                    onClick={handlePayment}
                    disabled={processing || !stripe}
                >
                    {processing ? 'Processing...' : 'Pay Salary'}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default CheckoutModal;