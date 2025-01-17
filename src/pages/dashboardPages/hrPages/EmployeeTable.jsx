import React, { useMemo } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';
import {
    Card,
    Typography,
    Button,
    Select,
    Option
} from "@material-tailwind/react";
import { X, Check, DollarSign } from 'lucide-react';

const DESIGNATIONS = [
    'Sales Assistant',
    'Social Media Executive',
    'Digital Marketer',
    'Content Writer',
    'Software Developer',
    'Graphic Designer',
    'Customer Support Specialist'
];

const EmployeeTable = ({
    employees,
    totalSalaries,
    onDesignationChange,
    onToggleVerification,
    onPayEmployee,
    onShowDetails,
    // onInitiateCheckout
}) => {
    // Enriched employees with total salary
    const enrichedEmployees = useMemo(() => {
        return employees.map(employee => {
            const employeeSalary = totalSalaries.find(entry => entry._id === employee.email)?.totalSalary || 0;
            return {
                ...employee,
                totalSalary: employeeSalary,
            };
        });
    }, [employees, totalSalaries]);

    // Columns Definition (keep all existing logic)
    const columns = useMemo(() => [
        {
            header: 'Name',
            accessorKey: 'name',
            cell: info => info.getValue()
        },
        {
            header: 'Email',
            accessorKey: 'email',
            cell: info => info.getValue()
        },
        {
            header: 'Designation',
            accessorKey: 'designation',
            cell: ({ row }) => {
                const employee = row.original;
                return employee.roleValue === 'HR' ? (
                    <Typography>{employee.roleValue}</Typography>
                ) :
                    employee.designation ? (
                        <Select
                            label={`Designation for ${employee.name}`}
                            value={employee.designation}
                            onChange={(value) => onDesignationChange(employee, value)}
                        >
                            {DESIGNATIONS.map((designation) => (
                                <Option key={designation} value={designation}>
                                    {designation}
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        <Select
                            label={`Designation for ${employee.name}`}
                            value={employee.designation}
                            onChange={(value) => onDesignationChange(employee, value)}
                        >
                            {DESIGNATIONS.map((designation) => (
                                <Option key={designation} value={designation}>
                                    {designation}
                                </Option>
                            ))}
                        </Select>
                    );
            }
        },
        {
            header: 'Verified',
            accessorKey: 'isVerified',
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <Button
                        variant="text"
                        color={employee.isVerified ? "green" : "red"}
                        onClick={() => onToggleVerification(employee)}
                        className="flex items-center gap-2"
                    >
                        {employee.isVerified ? <Check /> : <X />}
                        {employee.isVerified ? 'Verified' : 'NotVerified'}
                    </Button>
                );
            }
        },
        {
            header: 'Bank Account',
            accessorKey: 'bank_account_no',
            cell: info => info.getValue() || 'N/A'
        },
        {
            header: 'Salary to Pay',
            accessorKey: 'totalSalary',
            cell: info => `$${info.getValue() || 0}`
        },
        {
            header: 'Actions',
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex space-x-2">
                        <Button
                            variant="text"
                            color="blue"
                            onClick={() => onShowDetails(employee)}
                        >
                            Details
                        </Button>
                        <Button
                            variant="gradient"
                            color="blue"
                            disabled={!employee.isVerified}
                            onClick={() => onPayEmployee(employee)}
                            className="flex items-center gap-2"
                        >
                            <DollarSign className="h-4 w-4" />
                            Pay
                        </Button>
                    </div>
                );
            }
        }
    ], []);

    // Table instance
    const table = useReactTable({
        data: enrichedEmployees,
        columns,
        getCoreRowModel: getCoreRowModel()
    });

    return (
        <Card className="h-full w-full overflow-scroll">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="even:bg-blue-gray-50/50">
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    className="p-4"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );
};

export default EmployeeTable;