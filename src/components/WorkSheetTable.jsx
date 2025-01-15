import { Button, Typography } from '@material-tailwind/react';
import { Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import useAuth from '../hooks/useAuth';
import useWorkSheet from '../hooks/useWorkSheet';
import LoadingSpinner from './LoadingSpinner';

const WorkSheetTable = () => {
    const { user } = useAuth();
    const { workSheet, workSheetLoading, refetch } = useWorkSheet();
    const handleEditEntry = () => {
        // Function to be implemented
    };

    const handleDeleteEntry = () => {
        // Function to be implemented
    };

    if (workSheet[0] === null || workSheet.length === 0) {
        return (
            <div className="text-center py-4 text-neutral-600 dark:text-neutral-300">
                No work sheet entries found
            </div>
        );
    }

    return (
        <table className="w-full min-w-max table-auto text-left overflow-y-scroll border-2 max-h-screen">
            <thead>
                <tr>
                    {['Task', 'Hours', 'Date', 'Actions'].map((head) => (
                        <th
                            key={head}
                            className="border-b border-neutral-200 dark:border-neutral-700 p-4 "
                        >
                            <Typography
                                variant="small"
                                className="text-neutral-600 dark:text-neutral-300"
                            >
                                {head}
                            </Typography>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className=''>
                {workSheet.map((entry, index) => (
                    <tr
                        key={index}
                        className="hover:bg-neutral-50 dark:hover:bg-dark-background/50 border-2 border-neutral-200 dark:border-neutral-700"
                    >
                        <td className="p-4">{entry.task}</td>
                        <td className="p-4">{entry.hours}</td>
                        <td className="p-4">
                            {entry.date
                                ? new Date(entry.date).toLocaleDateString()
                                : 'Invalid Date'}
                        </td>
                        <td className="p-4 flex gap-2">
                            <Button
                                size="sm"
                                variant="text"
                                onClick={() => handleEditEntry(entry)}
                                className="text-primary-500 hover:bg-primary-50"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="text"
                                onClick={() => handleDeleteEntry(entry)}
                                className="text-danger-500 hover:bg-danger-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default WorkSheetTable;