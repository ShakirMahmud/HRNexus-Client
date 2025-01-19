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
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import usePayment from "../../../hooks/usePayment";
import Swal from "sweetalert2";

const PaymentProcessing = ({ employee, isOpen, onClose }) => {
    const axiosSecure = useAxiosSecure();

    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const { payments } = usePayment();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);
    

    // Check if payment already exists for the selected month and year
    const isPaymentAlreadyMade = () => {
        return payments.some(payment =>
            payment.employeeEmail === employee.email &&
            payment.month === parseInt(month) &&
            payment.year === parseInt(year)
        );
    };

    const handlePayment = async (event) => {
        event.preventDefault();

        if (!month || !year) {
            setError("Please provide both month and year");
            return;
        }

        if (isPaymentAlreadyMade()) {
            setError(`Payment for ${month}/${year} already exists`);
            return;
        }

        setProcessing(true);
        setError(null);

        const payment = {
            employeeEmail: employee.email,
            employeeName: employee.name,
            month: parseInt(month),
            year: parseInt(year),
            amount: employee.totalSalary,
            status: 'pending'
        };

        try {
            const response = await axiosSecure.post('/payments', payment);

            console.log('Response from backend:', response);

            if (response.data.result.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `Payment for ${employee.name} has been processed for ${month}/${year} to admin to verify`,
                    toast: true,
                    timer: 3000,
                    position: 'top-end',
                    showConfirmButton: false,
                });

                setProcessing(false); 
                onClose();
            } else {
                setError("An error occurred while processing the payment");
                setProcessing(false);
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while processing the payment");
            setProcessing(false); 
        }
    };

    return (
        <Dialog
            open={isOpen}
            handler={onClose}
            size="md"
            className="dark:bg-dark-surface"
            portal={{
                container: document.body,
            }}
        >
            <DialogHeader className="text-neutral-800 dark:text-neutral-100 border-b border-neutral-200 dark:border-dark-neutral-300">
                Salary Payment for {employee.name}
            </DialogHeader>
            <DialogBody>
                <div className="grid gap-4">
                    <Typography className="text-neutral-800 dark:text-neutral-100">
                        Total Salary:
                        <span className="text-primary-600 dark:text-dark-primary-400 ml-2">
                            ${employee.totalSalary}
                        </span>
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
                            className="dark:text-neutral-100"
                            labelProps={{
                                className: 'text-neutral-700 dark:text-neutral-300'
                            }}

                            menuProps={{
                                className: "bg-white dark:bg-dark-neutral-800 text-neutral-800 dark:text-neutral-300"
                            }}
                        >
                            {[...Array(12)].map((_, index) => (
                                <Option
                                    key={index + 1}
                                    value={index + 1}
                                    className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-neutral-700"
                                >
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
                            className="dark:text-neutral-100"
                            labelProps={{
                                className: 'text-neutral-700 dark:text-neutral-300'
                            }}

                            menuProps={{
                                className: "bg-white dark:bg-dark-neutral-800 text-neutral-800 dark:text-neutral-300"
                            }}
                        >
                            {[2023, 2024, 2025].map((yearOption) => (
                                <Option
                                    key={yearOption}
                                    value={yearOption}
                                    className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-neutral-700"
                                >
                                    {yearOption}
                                </Option>
                            ))}
                        </Select>
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
                    disabled={processing}
                    className="dark:bg-primary-600 dark:hover:bg-primary-500 dark:text-white"
                >
                    {processing ? 'Processing...' : 'Pay Salary'}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default PaymentProcessing;