import React, { useState, useMemo } from "react";
import useWorkSheet from "../../../hooks/useWorkSheet";
import { Select, Option, Typography, Card } from "@material-tailwind/react";

const Progress = () => {
    const { workSheet, workSheetLoading, refetch } = useWorkSheet();
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    // Get unique employee names for the dropdown
    const employeeNames = useMemo(() => {
        const names = [...new Set(workSheet.map(record => record.email))];
        return names;
    }, [workSheet]);

    // Filter work records based on selected employee and month
    const filteredWorkSheet = useMemo(() => {
        return workSheet.filter(record => {
            const recordDate = new Date(record.date);
            const monthMatches = selectedMonth ? recordDate.getMonth() + 1 === parseInt(selectedMonth) : true;
            const employeeMatches = selectedEmployee ? record.email === selectedEmployee : true;
            return monthMatches && employeeMatches;
        });
    }, [workSheet, selectedEmployee, selectedMonth]);

    // Calculate total hours worked
    const totalHours = useMemo(() => {
        return filteredWorkSheet.reduce((sum, record) => sum + record.hours, 0);
    }, [filteredWorkSheet]);

    return (
        <div className="container mx-auto p-4">
            <Card className="p-4 mb-4">
                <div className="flex gap-4 mb-4">
                    <Select
                        label="Select Employee"
                        value={selectedEmployee}
                        onChange={(value) => setSelectedEmployee(value)}
                    >
                        <Option value="">All Employees</Option>
                        {employeeNames.map((name) => (
                            <Option key={name} value={name}>
                                {name}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        label="Select Month"
                        value={selectedMonth}
                        onChange={(value) => setSelectedMonth(value)}
                    >
                        <Option value="">All Months</Option>
                        {[...Array(12)].map((_, index) => (
                            <Option key={index + 1} value={index + 1}>
                                {new Date(0, index).toLocaleString('default', { month: 'long' })}
                            </Option>
                        ))}
                    </Select>
                </div>

                <Typography variant="h6">
                    Total Hours: {totalHours}
                </Typography>
            </Card>

            <Card className="p-4">
                <Typography variant="h5" className="mb-4">
                    Work Records {selectedEmployee ? `for ${selectedEmployee}` : ''}
                </Typography>
                {filteredWorkSheet.length > 0 ? (
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th className="border-b">Task</th>
                                <th className="border-b">Hours</th>
                                <th className="border-b">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWorkSheet.map((record) => (
                                <tr key={record._id}>
                                    <td className="border-b">{record.task}</td>
                                    <td className="border-b">{record.hours}</td>
                                    <td className="border-b">{new Date(record.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <Typography>No records found for the selected filters.</Typography>
                )}
            </Card>
        </div>
    );
};

export default Progress;