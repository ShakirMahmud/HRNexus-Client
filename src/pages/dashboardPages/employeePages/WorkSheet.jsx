import React, { useState, useEffect } from 'react';
import {
    Card,
    Typography,
    Button,
    Alert
} from "@material-tailwind/react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { PlusIcon, AlertCircleIcon } from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import useWorkSheet from '../../../hooks/useWorkSheet';
import WorkSheetTable from './WorkSheetTable';
import useUsers from '../../../hooks/useUsers';

const DESIGNATION_TASKS = {
    'Social Media Executive': [
        'Social Media Content',
        'Campaign Management',
        'Content Creation',
        'Analytics Reporting'
    ],
    'Sales Assistant': [
        'Lead Generation',
        'Client Meetings',
        'Sales Reporting',
        'Customer Follow-up'
    ],
    'Digital Marketer': [
        'Market Research',
        'Digital Advertising',
        'SEO Optimization',
        'Content Strategy'
    ],
    'Content Writer': [
        'Blog Writing',
        'Copywriting',
        'Editing',
        'Proofreading',
        'Content Research'
    ],
    'Software Developer': [
        'Frontend Development',
        'Backend Development',
        'API Integration',
        'Bug Fixing',
        'Code Review'
    ],
    'Graphic Designer': [
        'UI/UX Design',
        'Graphic Creation',
        'Brand Design',
        'Illustration',
        'Design Review'
    ],
    'Customer Support Specialist': [
        'Customer Inquiry',
        'Technical Support',
        'Ticket Resolution',
        'Customer Feedback Analysis'
    ]
};

const WorkSheet = () => {
    const [selectedTask, setSelectedTask] = useState('');
    const [hoursWorked, setHoursWorked] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { refetch } = useWorkSheet();
    const { userByEmail, userByEmailLoading } = useUsers();

    // Determine available tasks based on user's designation
    const availableTasks = userByEmail?.designation
        ? DESIGNATION_TASKS[userByEmail.designation] || []
        : [];

    const handleAddEntry = async () => {
        // Check verification and designation
        if (!userByEmail?.isVerified || !userByEmail?.designation) {
            Swal.fire({
                icon: 'warning',
                title: 'Account Not Verified',
                text: 'Please contact HR to verify your account and set your designation',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Existing validation
        if (!selectedTask || !hoursWorked || hoursWorked <= 0) {
            Swal.fire({
                icon: 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                title: 'Invalid Entry',
                text: 'Please provide a valid task and hours'
            });
            return;
        }

        try {
            const entry = {
                task: selectedTask,
                hours: parseFloat(hoursWorked),
                date: selectedDate,
                email: user?.email,
                designation: userByEmail?.designation
            };

            const res = await axiosSecure.post('/workSheet', entry);

            if (res.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    title: 'Entry Added Successfully'
                });

                // Reset form
                setSelectedTask('');
                setHoursWorked('');
                setSelectedDate(new Date());

                refetch();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.message || 'Unable to add work sheet entry'
            });
        }
    };

    // Loading state
    if (userByEmailLoading) {
        return <div>Loading...</div>;
    }

    // Not verified or no designation
    const isNotVerifiedOrNoDesignation =
        !userByEmail?.isVerified || !userByEmail?.designation;

    return (
        <div className="container mx-auto p-4">
            <Card className="p-6 bg-white dark:bg-dark-surface shadow-elevated">
                {/* Verification Alert */}
                {isNotVerifiedOrNoDesignation && (
                    <Alert
                        color="amber"
                        icon={<AlertCircleIcon className="h-6 w-6" />}
                        className="mb-4"
                    >
                        {!userByEmail?.isVerified
                            ? "Your account is not verified. Please contact HR to verify your account."
                            : "Your designation is not set. Please contact HR to set your job role."}
                    </Alert>
                )}

                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 md:space-y-0">
                    {/* Task Selection */}
                    <div>
                        <Typography
                            variant="h6"
                            className="mb-2 text-neutral-700 dark:text-neutral-300 text-sm"
                        >
                            Select Task
                        </Typography>
                        <select
                            value={selectedTask}
                            onChange={(e) => setSelectedTask(e.target.value)}
                            className="w-full p-2 border rounded-md bg-neutral-50 dark:bg-dark-neutral-200 dark:text-neutral-300"
                            disabled={isNotVerifiedOrNoDesignation}
                        >
                            <option value="">Select a task</option>
                            {availableTasks.map((task) => (
                                <option key={task} value={task}>
                                    {task}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hours Input */}
                    <div>
                        <Typography
                            variant="h6"
                            className="mb-2 text-neutral-700 dark:text-neutral-300 text-sm"
                        >
                            Hours Worked
                        </Typography>
                        <input
                            type="number"
                            value={hoursWorked}
                            onChange={(e) => setHoursWorked(e.target.value)}
                            placeholder="Hours"
                            min="0"
                            step="0.5"
                            className="w-full p-2 border rounded-md bg-neutral-50 dark:bg-dark-neutral-200 dark:text-neutral-300"
                            disabled={isNotVerifiedOrNoDesignation}
                        />
                    </div>

                    {/* Date Picker */}
                    <div>
                        <Typography
                            variant="h6"
                            className="mb-2 text-neutral-700 dark:text-neutral-300 text-sm"
                        >
                            Date
                        </Typography>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            className="w-full p-2 border rounded-md bg-neutral-50 dark:bg-dark-neutral-200 dark:text-neutral-300"
                            disabled={isNotVerifiedOrNoDesignation}
                        />
                    </div>

                    {/* Add Entry Button */}
                    <div className="flex items-end">
                        <Button
                            onClick={handleAddEntry}
                            className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 flex items-center gap-2"
                            disabled={isNotVerifiedOrNoDesignation}
                        >
                            <PlusIcon className="h-5 w-5" />
                            Add Entry
                        </Button>
                    </div>
                </div>

                {/* Additional Information for Unverified Users */}
                {isNotVerifiedOrNoDesignation && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mt-4 flex items-center gap-4">
                        <AlertCircleIcon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        <div>
                            <Typography
                                variant="h6"
                                className="text-amber-700 dark:text-amber-300 mb-2"
                            >
                                Account Setup Required
                            </Typography>
                            <Typography
                                variant="paragraph"
                                className="text-neutral-600 dark:text-neutral-300"
                            >
                                To add work sheet entries, you need to:
                                <ul className="list-disc list-inside mt-2">
                                    {!userByEmail?.isVerified && (
                                        <li>Get your account verified by HR</li>
                                    )}
                                    {!userByEmail?.designation && (
                                        <li>Have your job designation set by HR</li>
                                    )}
                                </ul>
                            </Typography>
                        </div>
                    </div>
                )}

                {/* Table Section */}
                <div className="overflow-x-auto max-h-[70vh] mt-6">
                    <WorkSheetTable availableTasks={availableTasks} />
                </div>
            </Card>
        </div>
    );
};

export default WorkSheet;