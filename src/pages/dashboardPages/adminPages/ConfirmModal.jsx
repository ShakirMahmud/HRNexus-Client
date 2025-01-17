import React from 'react';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ConfirmModal = ({ isOpen, onClose, employee, refetch }) => {
    const axiosSecure = useAxiosSecure();

    const handleFireEmployee = async () => {
        try {
            const response = await axiosSecure.put(`/users/${employee._id}`, { isVerified: false });
            if (response.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Employee Fired',
                    text: `${employee.name} has been successfully fired.`,
                });
                refetch(); // Refresh the employee list
                onClose(); // Close the modal
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Could not fire ${employee.name}.`,
                });
            }
        } catch (error) {
            console.error("Error firing employee:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while trying to fire the employee.',
            });
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="md">
            <DialogHeader>Confirm Action</DialogHeader>
            <DialogBody>
                <Typography>
                    Are you sure you want to fire {employee?.name}?
                </Typography>
            </DialogBody>
            <DialogFooter>
                <Button color="red" onClick={handleFireEmployee}>
                    Yes, Fire
                </Button>
                <Button color="gray" onClick={onClose}>
                    Cancel
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default ConfirmModal;