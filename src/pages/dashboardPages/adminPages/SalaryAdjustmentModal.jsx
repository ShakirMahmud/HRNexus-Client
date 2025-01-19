import React, { useState, useEffect, useMemo } from 'react';
import { 
    Button, 
    Dialog, 
    DialogBody, 
    DialogFooter, 
    DialogHeader, 
    Input, 
    Typography 
} from "@material-tailwind/react";
import { 
    DollarSignIcon, 
    InfoIcon, 
    AlertCircleIcon 
} from 'lucide-react';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const SalaryAdjustmentModal = ({ isOpen, onClose, employee, refetch }) => {
    const axiosSecure = useAxiosSecure();
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Use useMemo to memoize derived values
    const modalContent = useMemo(() => {
        if (!employee) {
            return {
                isHR: false,
                initialSalary: '0',
                currentSalaryDisplay: 'N/A',
                currentSalaryPerHour: 0
            };
        }

        const isHR = employee.roleValue === 'HR';
        
        const currentSalaryDisplay = isHR 
            ? `$${((employee.salaryPerHour || 0) ).toFixed(2)} /month`
            : `$${(employee.salaryPerHour || 0).toFixed(2)} /hour`;

        const initialSalary = isHR 
            ? ((employee.salaryPerHour || 0)).toFixed(2)
            : (employee.salaryPerHour || 0).toFixed(2);

        return {
            isHR,
            initialSalary,
            currentSalaryDisplay,
            currentSalaryPerHour: employee.salaryPerHour || 0
        };
    }, [employee]);

    const [newSalary, setNewSalary] = useState(modalContent.initialSalary);

    // Reset salary when employee changes
    useEffect(() => {
        setNewSalary(modalContent.initialSalary);
    }, [modalContent.initialSalary]);

    // If no employee, return null to prevent rendering
    if (!employee) {
        return null;
    }

    const showErrorModal = (message) => {
        setErrorMessage(message);
        setErrorModalOpen(true);
    };

    const handleSalaryAdjustment = async () => {
        // Validate salary
        const parsedSalary = parseFloat(newSalary);
        if (isNaN(parsedSalary) || parsedSalary <= 0) {
            showErrorModal('Salary must be a positive number.');
            return;
        }

        // Calculate salary per hour
        const salaryPerHour = modalContent.isHR 
            ? parsedSalary
            : parsedSalary;

        // Prevent decreasing salary
        if (salaryPerHour < modalContent.currentSalaryPerHour) {
            showErrorModal(`You can only increase the salary. Current salary is $${(modalContent.currentSalaryPerHour).toFixed(2)} per hour.`);
            return;
        }
        

        try {
            const response = await axiosSecure.put(`/users/${employee._id}`, { 
                salaryPerHour: salaryPerHour 
            });

            if (response.data.modifiedCount > 0) {
                refetch();
                onClose();
                await Swal.fire({
                    icon: 'success',
                    title: 'Salary Adjusted',
                    text: `Salary for ${employee.name} has been updated.`,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                
                
            } else {
                showErrorModal(`Could not adjust salary for ${employee.name}.`);
            }
        } catch (error) {
            console.error("Error adjusting salary:", error);
            showErrorModal('An error occurred while trying to adjust the salary.');
        }
    };

    return (
        <>
            <Dialog 
                open={isOpen} 
                handler={onClose} 
                size="md" 
                className="dark:bg-dark-surface"
            >
                <DialogHeader className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-neutral-200 dark:border-dark-neutral-300 p-4">
                    <Typography 
                        variant="h5" 
                        className="text-neutral-800 dark:text-neutral-100 mb-2 md:mb-0"
                    >
                        Adjust Salary for {employee.name}
                    </Typography>
                    <Typography 
                        variant="h6" 
                        className="flex items-center text-primary-600 dark:text-dark-primary-400"
                    >
                        <DollarSignIcon className="mr-2 h-5 w-5" />
                        {modalContent.currentSalaryDisplay}
                    </Typography>
                </DialogHeader>
                
                <DialogBody className="p-4">
                    <div className="mb-4">
                        <Input
                            type="number"
                            label={modalContent.isHR ? "Monthly Salary" : "Hourly Rate"}
                            value={newSalary}
                            onChange={(e) => setNewSalary(e.target.value)}
                            icon={<DollarSignIcon />}
                            className="w-full"
                            labelProps={{
                                className: "text-neutral-700 dark:text-neutral-300"
                            }}
                            containerProps={{
                                className: "dark:text-neutral-100"
                            }}
                        />
                    </div>
                    
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                        <InfoIcon className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-300" />
                        <Typography 
                            variant="small" 
                            className="text-neutral-600 dark:text-neutral-300"
                        >
                            {modalContent.isHR 
                                ? "Enter the total monthly salary for this HR" 
                                : "Enter the hourly rate for this employee"
                            }
                        </Typography>
                    </div>
                </DialogBody>
                
                <DialogFooter className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 border-t border-neutral-200 dark:border-dark-neutral-300 p-4">
                    <Button 
                        variant="text" 
                        color="gray" 
                        onClick={onClose}
                        className="w-full md:w-auto dark:text-neutral-300 dark:hover:bg-dark-neutral-300"
                    >
                        Cancel
                    </Button>
                    <Button 
                        color="blue" 
                        onClick={handleSalaryAdjustment}
                        className="w-full md:w-auto dark:bg-primary-600 dark:hover:bg-primary-500"
                    >
                        Confirm Adjustment
                    </Button>
                </DialogFooter>
            </Dialog>
    
            {/* Error Modal */}
            <Dialog 
                open={errorModalOpen} 
                handler={() => setErrorModalOpen(false)}
                size="xs"
                className="dark:bg-dark-surface"
            >
                <DialogHeader 
                    className="flex items-center text-red-500 dark:text-danger-400 border-b border-neutral-200 dark:border-dark-neutral-300 p-4"
                >
                    <AlertCircleIcon className="mr-2 h-6 w-6" />
                    Error
                </DialogHeader>
                <DialogBody className="p-4">
                    <Typography 
                        color="red" 
                        variant="paragraph"
                        className="text-danger-500 dark:text-danger-400"
                    >
                        {errorMessage}
                    </Typography>
                </DialogBody>
                <DialogFooter className="border-t border-neutral-200 dark:border-dark-neutral-300 p-4">
                    <Button 
                        color="red" 
                        onClick={() => setErrorModalOpen(false)}
                        className="w-full dark:bg-danger-600 dark:hover:bg-danger-500"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default SalaryAdjustmentModal;