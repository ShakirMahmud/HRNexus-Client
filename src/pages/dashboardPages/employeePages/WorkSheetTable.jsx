import React, { useState, useCallback, useMemo } from 'react';
import {
    Button,
    Typography,
    Card,
    Chip
} from '@material-tailwind/react';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import useAuth from '../../../hooks/useAuth';
import useWorkSheet from '../../../hooks/useWorkSheet';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EditWorkSheetTable from './EditWorkSheetTable';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const WorkSheetTable = ({availableTasks}) => {
    const { user } = useAuth();
    const { workSheet, workSheetLoading, refetch } = useWorkSheet();
    const [selectedEntry, setSelectedEntry] = useState(null);
    const axiosSecure = useAxiosSecure();
    const [visibleEntries, setVisibleEntries] = useState(6);

    // Group entries by month and year
    const groupedEntries = useMemo(() => {
        const grouped = {};

        // Sort entries by most recent date first
        const sortedEntries = [...workSheet].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        sortedEntries.forEach(entry => {
            const date = new Date(entry.date);
            const key = `${date.toLocaleString('default', { month: 'short' })}/${date.getFullYear()}`;

            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(entry);
        });

        return grouped;
    }, [workSheet]);

    const handleEditEntry = (entry) => {
        setSelectedEntry(entry);
    };

    const handleCloseModal = () => {
        setSelectedEntry(null);
    };

    const handleDeleteEntry = async (entry) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/workSheet/${entry._id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire({
                            icon: 'success',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 1500,
                            title: 'Entry Deleted Successfully',
                        });
                        refetch();
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        });
    };

    const loadMoreEntries = () => {
        setVisibleEntries(prev => prev + 6);
    };

    if (workSheetLoading) {
        return <LoadingSpinner />;
    }

    if (!workSheet || workSheet.length === 0) {
        return (
            <div className="text-center py-4 text-neutral-600 dark:text-neutral-300">
                No work sheet entries found
            </div>
        );
    }

    return (
        <Card className="w-full overflow-hidden">
            <InfiniteScroll
                dataLength={visibleEntries}
                next={loadMoreEntries}
                hasMore={visibleEntries < workSheet.length}
                loader={<LoadingSpinner />}
                className="overflow-x-auto"
            >
                {Object.entries(groupedEntries).map(([monthYear, entries]) => (
                    <div key={monthYear} className="mb-6">
                        {/* Month Header */}
                        <div className="bg-primary-50 dark:bg-dark-primary-900/20 p-3 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary-500 dark:text-primary-400" />
                            <Typography
                                variant="h6"
                                className="text-primary-600 dark:text-primary-300"
                            >
                                {monthYear}
                            </Typography>
                        </div>

                        {/* Mobile View: Card Layout */}
                        <div className="block md:hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 lg:py-0 lg:p-4">
                                {entries.slice(0, visibleEntries).map((entry, index) => (
                                    <Card
                                        key={index}
                                        className="border border-neutral-200 dark:border-dark-neutral-300 p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <Typography
                                                variant="h6"
                                                className="text-neutral-700 dark:text-neutral-300"
                                            >
                                                {entry.task}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="text-neutral-500 dark:text-neutral-400"
                                            >
                                                {new Date(entry.date).toLocaleDateString()}
                                            </Typography>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <Typography
                                                variant="paragraph"
                                                className="text-neutral-600 dark:text-neutral-300"
                                            >
                                                Hours Worked: {entry.hours}h
                                            </Typography>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="text"
                                                    onClick={() => handleEditEntry(entry)}
                                                    className="text-primary-500 hover:bg-primary-50 dark:hover:bg-dark-primary-900/10"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="text"
                                                    onClick={() => handleDeleteEntry(entry)}
                                                    className="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Desktop View: Table Layout */}
                        <div className="hidden md:block">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {['Task', 'Hours', 'Date', 'Actions'].map((head) => (
                                            <th
                                                key={head}
                                                className="border-b border-neutral-200 dark:border-dark-neutral-300 p-4 text-center "
                                            >
                                                <Typography
                                                    variant="small"
                                                    className="text-neutral-600 dark:text-neutral-300 font-medium text-base"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.slice(0, visibleEntries).map((entry, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-neutral-50 dark:hover:bg-dark-background/50 border-b border-neutral-200 dark:border-dark-neutral-300"
                                        >
                                            <td className="p-4 w-[30%] text-center ">  
                                                <Typography
                                                    variant="small"
                                                    className="text-neutral-700 dark:text-neutral-300"
                                                >
                                                    {entry.task}
                                                </Typography>
                                            </td>
                                            <td className="p-4 w-[20%] text-center">  {/* For Hours */}
                                                <Chip
                                                    value={`${entry.hours}h`}
                                                    variant="ghost"
                                                    color="blue"
                                                    size="sm"
                                                    className="w-fit inline-block mx-auto"
                                                />
                                            </td>
                                            <td className="p-4 w-[25%] text-center">  {/* For Date */}
                                                <Typography
                                                    variant="small"
                                                    className="text-neutral-600 dark:text-neutral-400"
                                                >
                                                    {new Date(entry.date).toLocaleDateString()}
                                                </Typography>
                                            </td>
                                            <td className="p-4 w-[25%] text-right">  {/* For Actions */}
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="text"
                                                        onClick={() => handleEditEntry(entry)}
                                                        className="text-primary-500 hover:bg-primary-50 dark:hover:bg-dark-primary-900/10"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="text"
                                                        onClick={() => handleDeleteEntry(entry)}
                                                        className="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                           
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </InfiniteScroll>

            {/* Edit Modal */}
            {selectedEntry && (
                <EditWorkSheetTable
                availableTasks={availableTasks}
                    entry={selectedEntry}
                    open={!!selectedEntry}
                    onClose={handleCloseModal}
                    refetch={refetch}
                />
            )}
        </Card>
    );
};

export default WorkSheetTable;