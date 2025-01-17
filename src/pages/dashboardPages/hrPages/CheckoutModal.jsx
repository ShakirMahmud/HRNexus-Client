import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select, Typography } from "@material-tailwind/react";

const CheckoutModal = ({ employee, isOpen, onClose }) => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const axiosSecure = useAxiosSecure();

    const handlePayment = async () => {
        // Validation
        if (!month || !year) {
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Information',
                text: 'Please provide both month and year'
            });
            return;
        }

        try {
            // Prepare payment request
            const paymentRequest = {
                employeeEmail: employee.email,
                employeeName: employee.name,
                month,
                year,
                amount: employee.totalSalary,
                status: 'Pending'
            };

            // Submit payment request
            const response = await axiosSecure.post('/payment-requests', paymentRequest);
            
            Swal.fire({
                icon: 'success',
                title: 'Payment Request Submitted',
                text: `Payment request for ${employee.name} has been sent for approval`
            });

            onClose();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Payment Request Failed',
                text: error.response?.data?.message || 'Could not submit payment request'
            });
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose}>
            <DialogHeader>Initiate Payment for {employee.name}</DialogHeader>
            <DialogBody>
                <div className="grid gap-4">
                    <Typography>
                        Total Salary: ${employee.totalSalary}
                    </Typography>
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
            </DialogBody>
            <DialogFooter>
                <Button 
                    color="blue" 
                    onClick={handlePayment}
                >
                    Submit Payment Request
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default CheckoutModal;