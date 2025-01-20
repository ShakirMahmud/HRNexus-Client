import React, { useState, useMemo, useCallback } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import useWorkSheet from "../../../hooks/useWorkSheet";
import {
    Select,
    Option,
    Typography,
    Card,
    Chip
} from "@material-tailwind/react";
import {
    Clock,
    User,
    Calendar,
    ListChecks
} from 'lucide-react';

const Progress = () => {
    const { workSheet, workSheetLoading, refetch } = useWorkSheet();
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [visibleRecords, setVisibleRecords] = useState(10);

    const employeeNames = useMemo(() => {
        const names = [...new Set(workSheet.map(record => record.email))];
        return names;
    }, [workSheet]);

    // Filter work records based on selected employee and month
    const filteredWorkSheet = useMemo(() => {
        return workSheet.filter(record => {
            const recordDate = new Date(record.date);
            const monthMatches = selectedMonth
                ? recordDate.getMonth() + 1 === parseInt(selectedMonth)
                : true;
            const employeeMatches = selectedEmployee
                ? record.email === selectedEmployee
                : true;
            return monthMatches && employeeMatches;
        });
    }, [workSheet, selectedEmployee, selectedMonth]);

    // Group records by year and month
    const groupedRecords = useMemo(() => {
        const grouped = {};
        filteredWorkSheet.forEach(record => {
            const date = new Date(record.date);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(record);
        });
        return Object.entries(grouped)
            .sort(([a], [b]) => {
                const [aYear, aMonth] = a.split('-').map(Number);
                const [bYear, bMonth] = b.split('-').map(Number);
                return bYear - aYear || bMonth - aMonth;
            });
    }, [filteredWorkSheet]);

    // Calculate total hours worked
    const totalHours = useMemo(() => {
        return filteredWorkSheet.reduce((sum, record) => sum + record.hours, 0);
    }, [filteredWorkSheet]);

    // Infinite scroll load more
    const loadMore = useCallback(() => {
        setVisibleRecords(prev => prev + 10);
    }, []);

    return (
        <div className="container mx-auto p-4 space-y-4 dark:bg-dark-neutral-50">
            {/* Filters */}
            <Card className="p-4 dark:bg-dark-neutral-100">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="w-full md:w-1/2 ">
                        <Typography
                            variant="small"
                            className="mb-2 flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                        >
                            <User className="h-4 w-4 text-primary-500 dark:text-dark-primary-400" />
                            Select Employee
                        </Typography>
                        <Select
                            label="Select Employee"
                            value={selectedEmployee}
                            onChange={(value) => setSelectedEmployee(value || '')}
                            labelProps={{
                                className: 'text-neutral-700  dark:!text-neutral-300 peer-focus:!text-primary-500 dark:peer-focus:!text-dark-primary-400'
                            }}
                            className="dark:text-neutral-100 dark:bg-dark-neutral-50"
                            color="blue"
                            variant="outlined"
                        >
                            <Option
                                value=""
                                className="text-neutral-700  dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-neutral-700"
                            >
                                All Employees
                            </Option>
                            {employeeNames.map((name) => (
                                <Option
                                    key={name}
                                    value={name}
                                    className="text-neutral-700  dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-neutral-700"
                                >
                                    {name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <div className="w-full md:w-1/2">
                        <Typography
                            variant="small"
                            className="mb-2 flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                        >
                            <Calendar className="h-4 w-4 text-primary-500 dark:text-dark-primary-400" />
                            Select Month
                        </Typography>
                        <Select
                            label="Select Month"
                            value={selectedMonth}
                            onChange={(value) => setSelectedMonth(value || '')}
                            labelProps={{
                                className: 'text-neutral-700 dark:!text-neutral-300 peer-focus:!text-primary-500 dark:peer-focus:!text-dark-primary-400'
                            }}
                            className="dark:text-neutral-100"
                            color="blue"
                            variant="outlined"
                        >
                            <Option
                                value=""
                                className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-neutral-700"
                            >
                                All Months
                            </Option>
                            {[...Array(12)].map((_, index) => (
                                <Option
                                    key={index + 1}
                                    value={`${index + 1}`}
                                    className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-dark-neutral-700"
                                >
                                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Total Hours */}
                <div className="flex items-center gap-2 mt-4">
                    <Clock className="h-6 w-6 text-primary-500 dark:text-dark-primary-400" />
                    <Typography
                        variant="h6"
                        className="font-semibold text-neutral-800 dark:text-neutral-100"
                    >
                        Total Hours:
                        <span className="text-primary-600 dark:text-dark-primary-400 ml-2">
                            {totalHours.toFixed(2)}
                        </span>
                    </Typography>
                </div>
            </Card>

            {/* Work Records */}
            <Card className="p-4 dark:bg-dark-neutral-100">
                <Typography
                    variant="h5"
                    className="mb-4 flex items-center gap-2 text-neutral-700 dark:text-neutral-300"
                >
                    <ListChecks className="h-6 w-6 text-primary-500 dark:text-dark-primary-400" />
                    Work Records {selectedEmployee && `for ${selectedEmployee}`}
                </Typography>

                {filteredWorkSheet.length > 0 ? (
                    <InfiniteScroll
                        dataLength={visibleRecords}
                        next={loadMore}
                        hasMore={visibleRecords < filteredWorkSheet.length}
                        loader={
                            <Typography
                                className="text-center my-4 text-neutral-600 dark:text-neutral-300"
                            >
                                Loading more...
                            </Typography>
                        }
                    >
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            {groupedRecords.slice(0, Math.ceil(visibleRecords / 5)).map(([key, records]) => {
                                const [year, month] = key.split('-').map(Number);
                                return (
                                    <div key={key} className="mb-6">
                                        <Typography
                                            variant="h6"
                                            className="mb-3 text-primary-600 dark:text-dark-primary-400 border-b pb-2"
                                        >
                                            {new Date(0, month - 1).toLocaleString('default', { month: 'long' })} {year}
                                        </Typography>

                                        <table className="w-full table-auto">
                                            <thead>
                                                <tr className="bg-neutral-50 dark:bg-dark-neutral-200">
                                                    <th className="p-2 text-left w-1/4 text-neutral-700 dark:text-neutral-300">Task</th>
                                                    <th className="p-2 text-left w-1/3 text-neutral-700 dark:text-neutral-300">Entry By</th>
                                                    <th className="p-2 text-center w-1/4 text-neutral-700 dark:text-neutral-300">Hours</th>
                                                    <th className="p-2 text-right w-1/4 text-neutral-700 dark:text-neutral-300">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.map((record) => (
                                                    <tr
                                                        key={record._id}
                                                        className="hover:bg-neutral-50 dark:hover:bg-dark-neutral-300"
                                                    >
                                                        <td className="p-2 border-b text-neutral-800 dark:text-neutral-100">{record.task}</td>
                                                        <td className="p-2 border-b text-neutral-800 dark:text-neutral-100">{record.email}</td>
                                                        <td className="p-2 border-b text-center">
                                                            <div className="inline-block">
                                                                <Chip
                                                                    variant="ghost"
                                                                    color="blue"
                                                                    size="sm"
                                                                    value={`${record.hours}h`}
                                                                    className="w-[60px] text-center justify-center dark:text-neutral-300"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="p-2 border-b text-right text-neutral-800 dark:text-neutral-100">
                                                            {new Date(record.date).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile View */}
                        <div className="block md:hidden space-y-4">
                            {groupedRecords.slice(0, Math.ceil(visibleRecords / 5)).map(([key, records]) => {
                                const [year, month] = key.split('-').map(Number);
                                return (
                                    <div key={key}>
                                        <Typography
                                            variant="h6"
                                            className="mb-3 text-primary-600 dark:text-dark-primary-400 border-b pb-2"
                                        >
                                            {new Date(0, month - 1).toLocaleString('default', { month: 'long' })} {year}
                                        </Typography>

                                        {records.map((record) => (
                                            <Card
                                                key={record._id}
                                                className="mb-4 p-4 border border-neutral-200 dark:border-dark-neutral-300 dark:bg-dark-neutral-200"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <Typography
                                                        variant="small"
                                                        className="font-bold text-neutral-800 dark:text-neutral-100"
                                                    >
                                                        {record.task}
                                                    </Typography>
                                                    <Chip
                                                        variant="ghost"
                                                        color="blue"
                                                        size="sm"
                                                        value={`${record.hours}h`}
                                                        className="dark:text-neutral-300"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Typography
                                                            variant="small"
                                                            className="text-neutral-600 dark:text-neutral-400"
                                                        >
                                                            Entry By
                                                        </Typography>
                                                        <Typography
                                                            variant="small"
                                                            className="text-neutral-800 dark:text-neutral-100"
                                                        >
                                                            {record.email}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography
                                                            variant="small"
                                                            className="text-neutral-600 dark:text-neutral-400"
                                                        >
                                                            Date
                                                        </Typography>
                                                        <Typography
                                                            variant="small"
                                                            className="text-neutral-600 dark:text-neutral-400"
                                                        >
                                                            {new Date(record.date).toLocaleDateString()}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </InfiniteScroll>
                ) : (
                    <div className="text-center py-6">
                        <Typography
                            variant="h6"
                            className="text-neutral-600 dark:text-neutral-300"
                        >
                            No records found for the selected filters.
                        </Typography>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Progress;