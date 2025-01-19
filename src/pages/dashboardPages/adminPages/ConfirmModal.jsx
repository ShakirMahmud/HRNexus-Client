import React from 'react';
import { 
    Button, 
    Dialog, 
    DialogBody, 
    DialogFooter, 
    DialogHeader, 
    Typography 
} from "@material-tailwind/react";
import { 
    TrashIcon, 
    XCircleIcon 
} from 'lucide-react';
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ConfirmModal = ({ isOpen, onClose, employee, refetch }) => {
    const axiosSecure = useAxiosSecure();

    const handleFireEmployee = async () => {
        try {
            const updatedUser = { 
                isFired: true,
                fireDate: new Date().toISOString()
            };
            const response = await axiosSecure.put(`/users/${employee._id}`, updatedUser);
            
            if (response.data.modifiedCount > 0) {
                refetch();
                onClose();
                await Swal.fire({
                    icon: 'success',
                    title: 'Employee Fired',
                    html: `
                        <div class="text-center">
                            <p>${employee.name} has been successfully fired.</p>
                            <small class="text-gray-500 dark:text-neutral-400">Their account is now deactivated.</small>
                        </div>
                    `,
                    showConfirmButton: false,
                    timer: 3000,
                    background: 'var(--background-color)',
                    color: 'var(--text-color)'
                });
                
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Could not fire ${employee.name}.`,
                    background: 'var(--background-color)',
                    color: 'var(--text-color)'
                });
            }
        } catch (error) {
            console.error("Error firing employee:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while trying to fire the employee.',
                background: 'var(--background-color)',
                color: 'var(--text-color)'
            });
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            handler={onClose} 
            size="xs"
            className="bg-white dark:bg-dark-surface"
        >
            <DialogHeader 
                className="flex items-center justify-between 
                    bg-red-50 dark:bg-dark-neutral-200 
                    text-red-800 dark:text-danger-400 
                    border-b border-red-200 dark:border-dark-neutral-300 
                    p-4"
            >
                <div className="flex items-center space-x-2">
                    <TrashIcon className="h-6 w-6 text-red-600 dark:text-danger-400" />
                    <Typography 
                        variant="h5" 
                        className="text-red-800 dark:text-danger-400"
                    >
                        Confirm Termination
                    </Typography>
                </div>
                <XCircleIcon 
                    className="h-6 w-6 text-red-400 dark:text-danger-500 cursor-pointer 
                        hover:text-red-600 dark:hover:text-danger-300" 
                    onClick={onClose}
                />
            </DialogHeader>
            
            <DialogBody className="text-center py-6">
                <div className="mb-4">
                    <Typography 
                        variant="h6" 
                        className="mb-2 text-neutral-800 dark:text-neutral-100"
                    >
                        Are you sure you want to fire?
                    </Typography>
                    <Typography 
                        variant="paragraph" 
                        className="text-neutral-700 dark:text-neutral-300"
                    >
                        {employee?.name} will lose access to all systems.
                    </Typography>
                </div>
                
                <div className="flex flex-col space-y-2">
                    <div className="bg-red-100 dark:bg-dark-neutral-300 p-3 rounded-lg border border-red-200 dark:border-dark-neutral-400">
                        <Typography 
                            variant="small" 
                            className="text-red-600 dark:text-danger-400"
                        >
                            ⚠️ This action cannot be undone
                        </Typography>
                    </div>
                </div>
            </DialogBody>
            
            <DialogFooter 
                className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 
                    bg-red-50 dark:bg-dark-neutral-200 
                    border-t border-red-100 dark:border-dark-neutral-300 
                    p-4"
            >
                <Button 
                    variant="text" 
                    color="gray" 
                    onClick={onClose}
                    className="w-full sm:w-auto 
                        dark:text-neutral-300 dark:hover:bg-dark-neutral-300"
                >
                    Cancel
                </Button>
                <Button 
                    color="red" 
                    onClick={handleFireEmployee}
                    className="w-full sm:w-auto flex items-center justify-center
                        dark:bg-danger-600 dark:hover:bg-danger-500"
                >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Confirm Fire
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default ConfirmModal;