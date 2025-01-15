import React, { useState } from 'react';
import {
    Card,
    Typography,
    Select,
    Option,
    Input,
    Button
} from "@material-tailwind/react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import WorkSheetTable from '../../../components/WorkSheetTable';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const WorkSheet = () => {
    const [selectedTask, setSelectedTask] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [workSheetEntries, setWorkSheetEntries] = useState([]);
    const [editingEntry, setEditingEntry] = useState(null);
    const axiosSecure = useAxiosSecure();
    const {user} = useAuth();

    const taskOptions = [
        'Sales',
        'Support',
        'Content',
        'Paper-work',
        'Research',
        'Development'
    ];

    const handleAddEntry = async () => {
        if (!selectedTask || !hoursWorked || !selectedDate) {
            // Optional: Show a toast or alert
            Swal.fire({
                icon: 'error',
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 1500,
                title: 'Incomplete Form',
                text: 'Please fill in all fields before adding an entry'
            });
            return;
        }
        // get form data
        const entry = {
            task: selectedTask,
            hours: hoursWorked,
            date: selectedDate,
            email: user?.email
        };

        const res = await axiosSecure.post('/workSheet', entry)
            .then(res => {
                if (res.data.insertedId) {
                    Swal.fire({
                        icon: 'success',
                        toast: true,
                        position: 'top',
                        showConfirmButton: false,
                        timer: 1500,
                        title: 'Success',
                        text: 'Entry added successfully'
                    });
                }
            })
            .catch(err => {
                console.log(err);
                Swal.fire({
                    icon: 'error',
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 1500,
                    title: 'Error',
                    text: 'Error adding entry'
                });
            });
    };

    const handleEditEntry = () => {
        // Function to be implemented
    };

    const handleDeleteEntry = () => {
        // Function to be implemented
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="p-6 bg-white dark:bg-dark-surface shadow-elevated">
                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <Typography
                            variant="small"
                            className="mb-2 text-neutral-700 dark:text-neutral-300"
                        >
                            Select Task
                        </Typography>
                        <Select
                            value={selectedTask}
                            required
                            onChange={(value) => setSelectedTask(value)}
                            label="Choose Task"
                            color="blue"
                            className="bg-neutral-50 dark:bg-dark-background"
                        >
                            {taskOptions.map((task) => (
                                <Option key={task} value={task}>
                                    {task}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div>
                        <Typography
                            variant="small"
                            className="mb-2 text-neutral-700 dark:text-neutral-300"
                        >
                            Hours Worked
                        </Typography>
                        <Input
                            type="number"
                            value={hoursWorked}
                            required
                            onChange={(e) => setHoursWorked(e.target.value)}
                            label="Hours"
                            color="blue"
                            className="bg-neutral-50 dark:bg-dark-background"
                        />
                    </div>

                    <div>
                        <Typography
                            variant="small"
                            className="mb-2 text-neutral-700 dark:text-neutral-300"
                        >
                            Date
                        </Typography>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            className="w-full p-2 border rounded-md bg-neutral-50 dark:bg-dark-background dark:text-neutral-300"
                        />
                    </div>

                    <div className="flex items-end">
                        <Button
                            onClick={handleAddEntry}
                            color="blue"
                            className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500"
                        >
                            Add Entry
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto max-h-[70vh]">
                    <WorkSheetTable
                        workSheetEntries={workSheetEntries}
                        handleEditEntry={handleEditEntry}
                        handleDeleteEntry={handleDeleteEntry}
                    />
                </div>
            </Card>
        </div>
    );
};

export default WorkSheet;