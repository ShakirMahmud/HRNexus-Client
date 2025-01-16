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
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const EditWorkSheetTable = ({ entry, open, onClose, refetch }) => {
    const [selectedTask, setSelectedTask] = useState(entry.task);
    const [hours, setHours] = useState(entry.hours);
    const [date, setDate] = useState(entry.date);
    const axiosSecure = useAxiosSecure();

    const taskOptions = [
        'Sales',
        'Support',
        'Content',
        'Paper-work',
        'Research',
        'Development'
    ];

    const handleUpdate = async () => {
        console.log(entry._id, selectedTask, hours, date);
        const updatedEntry = { task: selectedTask, hours: hours, date: date };
        const res = await axiosSecure.put(`/workSheet/${entry._id}`, updatedEntry)
            .then(res => {
                onClose();
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        icon: 'success',
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 1500,
                        title: 'Entry Updated Successfully',
                    })
                    refetch();
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <Dialog open={open} handler={onClose} size="xs">
            <DialogHeader className="flex items-center justify-between">
                <Typography variant="h4">Edit Work Entry</Typography>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 cursor-pointer"
                    onClick={onClose}
                >
                    <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </DialogHeader>
            <DialogBody>
                <div className="grid gap-6">
                    <Select
                        label="Select Task"
                        value={selectedTask}
                        onChange={(value) => setSelectedTask(value)}
                    >
                        {taskOptions.map((task) => (
                            <Option key={task} value={task}>
                                {task}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        label="Hours Worked"
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={new Date(date).toISOString().split('T')[0]}
                        onChange={(e) => setDate(new Date(e.target.value))}
                    />
                </div>
            </DialogBody>
            <DialogFooter className="space-x-2">
                <Button variant="text" color="gray" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={handleUpdate}
                >
                    Update
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EditWorkSheetTable;