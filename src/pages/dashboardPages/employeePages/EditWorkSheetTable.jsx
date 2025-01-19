import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
    Select,
    Option
} from "@material-tailwind/react";
import { X, Save, Calendar, Clock, ListChecks } from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const EditWorkSheetTable = ({ entry, open, onClose, refetch, availableTasks }) => {
    const [selectedTask, setSelectedTask] = useState(entry.task);
    const [hours, setHours] = useState(entry.hours);
    const [date, setDate] = useState(entry.date);
    const axiosSecure = useAxiosSecure();

    const handleUpdate = async () => {
        // Validation
        if (!selectedTask || !hours || hours <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all fields correctly',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }

        try {
            const updatedEntry = { 
                task: selectedTask, 
                hours: parseFloat(hours), 
                date: date 
            };

            const res = await axiosSecure.put(`/workSheet/${entry._id}`, updatedEntry);
            
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Entry Updated',
                    text: 'Your work entry has been successfully updated',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500
                });
                
                refetch();
                onClose();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Unable to update the entry. Please try again.',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    return (
        <Dialog 
            open={open} 
            handler={onClose} 
            size="xs"
            className="max-h-[90vh] overflow-auto"
        >
            <DialogHeader className="flex items-center justify-between p-4 bg-primary-50 dark:bg-dark-neutral-50">
                <Typography 
                    variant="h5" 
                    className="text-primary-600 dark:text-primary-300 flex items-center gap-2"
                >
                    <ListChecks className="h-6 w-6" />
                    Edit Work Entry
                </Typography>
                <Button
                    variant="text"
                    color="gray"
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-dark-neutral-300"
                >
                    <X className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                </Button>
            </DialogHeader>
            
            <DialogBody className="space-y-6 p-4 dark:bg-dark-neutral-100">
                <div>
                    <Typography 
                        variant="small" 
                        className="mb-2 text-neutral-700 dark:text-neutral-300"
                    >
                        Select Task
                    </Typography>
                    <select
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                        className="w-full p-2 border rounded-md bg-neutral-50 dark:bg-dark-neutral-200 dark:text-neutral-300"
                    >
                        <option value="">Select a task</option>
                        {availableTasks.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <Typography 
                        variant="small" 
                        className="mb-2 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
                    >
                        <Clock className="h-4 w-4" />
                        Hours Worked
                    </Typography>
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        min="0"
                        step="0.5"
                        className="w-full p-2 border rounded-md bg-neutral-50 dark:bg-dark-neutral-200 dark:text-neutral-300"
                        placeholder="Enter hours worked"
                    />
                </div>

                <div>
                    <Typography 
                        variant="small" 
                        className="mb-2 text-neutral-700 dark:text-neutral-300 flex items-center gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Date
                    </Typography>
                    <input
                        type="date"
                        value={new Date(date).toISOString().split('T')[0]}
                        onChange={(e) => setDate(new Date(e.target.value))}
                        className="w-full p-2 border rounded-md bg-neutral-50 dark:bg-dark-neutral-200 dark:text-neutral-300"
                    />
                </div>
            </DialogBody>
            
            <DialogFooter className="flex justify-between p-4 bg-neutral-50 dark:bg-dark-neutral-50">
                <Button 
                    variant="text" 
                    color="gray" 
                    onClick={onClose}
                    className="hover:bg-neutral-200 dark:hover:bg-dark-neutral-300 dark:text-neutral-300"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleUpdate}
                    className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 flex items-center gap-2"
                >
                    <Save className="h-5 w-5" />
                    Update
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EditWorkSheetTable;