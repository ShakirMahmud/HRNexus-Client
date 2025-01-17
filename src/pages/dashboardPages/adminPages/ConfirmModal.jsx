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
                            <small class="text-gray-500">Their account is now deactivated.</small>
                        </div>
                    `,
                    showConfirmButton: false,
                    timer: 3000
                });
                
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Could not fire ${employee.name}.`,
                });
            }
        } catch (error) {
            console.error("Error firing employee:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while trying to fire the employee.',
            });
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            handler={onClose} 
            size="xs"
            className="bg-red-50"
        >
            <DialogHeader 
                className="flex items-center justify-between bg-red-100 text-red-800 border-b border-red-200"
            >
                <div className="flex items-center space-x-2">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                    <Typography variant="h5" color="red">
                        Confirm Termination
                    </Typography>
                </div>
                <XCircleIcon 
                    className="h-6 w-6 text-red-400 cursor-pointer hover:text-red-600" 
                    onClick={onClose}
                />
            </DialogHeader>
            
            <DialogBody className="text-center py-6">
                <div className="mb-4">
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                        Are you sure you want to fire?
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray">
                        {employee?.name} will lose access to all systems.
                    </Typography>
                </div>
                
                <div className="flex flex-col space-y-2">
                    <div className="bg-red-100 p-3 rounded-lg border border-red-200">
                        <Typography variant="small" color="red">
                            ⚠️ This action cannot be undone
                        </Typography>
                    </div>
                </div>
            </DialogBody>
            
            <DialogFooter className="space-x-2 bg-red-50 border-t border-red-100">
                <Button 
                    variant="text" 
                    color="gray" 
                    onClick={onClose}
                    className="mr-2"
                >
                    Cancel
                </Button>
                <Button 
                    color="red" 
                    onClick={handleFireEmployee}
                    className="flex items-center"
                >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Confirm Fire
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default ConfirmModal;