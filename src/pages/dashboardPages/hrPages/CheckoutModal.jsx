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

const CheckoutModal = ({ employee, isOpen, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();

    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');

    const { payments } = usePayment();

    // Check if payment already exists for the selected month and year
    const isPaymentAlreadyMade = () => {
        return payments.some(payment => 
            payment.employeeEmail === employee.email && 
            payment.month === parseInt(month) && 
            payment.year === parseInt(year)
        );
    };

    // Create payment intent when modal opens and total salary is available
    useEffect(() => {
        if (isOpen && employee?.totalSalary > 0) {
            axiosSecure.post('/payments/paymentIntent', {
                salary: employee.totalSalary
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
        if (!month || !year) {
            setError("Please provide both month and year");
            return;
        }

        // Check for duplicate payment
        if (isPaymentAlreadyMade()) {
            setError(`Payment for ${month}/${year} already exists`);
            return;
        }

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
                    month: parseInt(month),
                    year: parseInt(year),
                    amount: employee.totalSalary,
                    transactionId: paymentIntent.id,
                    status: 'pending'
                };

                // Submit payment request to backend
                await axiosSecure.post('/payments', paymentRequest);

                // Show success toast
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: `Payment for ${employee.name} has been processed`,
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

    return (
        <Dialog open={isOpen} handler={onClose} size="md">
            <DialogHeader>Salary Payment for {employee.name}</DialogHeader>
            <DialogBody>
                <div className="grid gap-4">
                    <Typography>
                        Total Salary: ${employee.totalSalary}
                    </Typography>

                    {/* Month and Year Selection */}
                    <div className="grid lg:grid-cols-2 gap-4">
                        <Select
                            label="Payment Month"
                            value={month}
                            onChange={(value) => {
                                setMonth(value);
                                setError(null); 
                            }}
                            error={!!error} 
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
                            onChange={(value) => {
                                setYear(value);
                                setError(null); 
                            }}
                            error={!!error}
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
                        <Typography color="red" variant="small" className="mt-2">
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