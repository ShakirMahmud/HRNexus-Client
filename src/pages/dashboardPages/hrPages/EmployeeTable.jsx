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
    Option,
    Chip
} from "@material-tailwind/react";
import { X, Check, DollarSign, UserIcon, MailIcon } from 'lucide-react';

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

    // Columns Definition
    const columns = useMemo(() => [
        {
            header: 'Employee',
            accessorKey: 'name',
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-neutral-600" />
                        <div>
                            <Typography variant="small" className="font-bold">
                                {employee.name}
                            </Typography>
                            <Typography
                                variant="small"
                                className="text-neutral-600 dark:text-neutral-400 break-words max-w-[200px]"
                            >
                                {employee.email}
                            </Typography>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Designation',
            accessorKey: 'designation',
            cell: ({ row }) => {
                const employee = row.original;
                return employee.roleValue === 'HR' ? (
                    <Chip
                        value={employee.roleValue}
                        variant="ghost"
                        color="blue"
                        size="sm"
                    />
                ) : (
                    <Select
                        label={`Designation`}
                        value={employee.designation}
                        onChange={(value) => onDesignationChange(employee, value)}
                        containerProps={{ className: 'min-w-[100px]' }}
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
            header: 'Verification',
            accessorKey: 'isVerified',
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <Chip
                        variant="ghost"
                        color={employee.isVerified ? "green" : "red"}
                        value={employee.isVerified ? "Verified" : "Not Verified"}
                        icon={employee.isVerified ? <Check /> : <X />}
                        onClick={() => onToggleVerification(employee)}
                        className="cursor-pointer"
                    />
                );
            }
        },
        {
            header: 'Bank & Salary to Pay',
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div>
                        <Typography variant="small" className="font-bold">
                            Account: {employee.bank_account_no || 'N/A'}
                        </Typography>
                        <Typography
                            variant="small"
                            color="green"
                            className="flex items-center gap-1"
                        >
                            <DollarSign className="h-4 w-4" />
                            ${employee.totalSalary || 0}
                        </Typography>
                    </div>
                );
            }
        },
        {
            header: 'Actions',
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex flex-col md:flex-row gap-2">
                        <Button
                            variant="text"
                            color="blue"
                            size="sm"
                            onClick={() => onShowDetails(employee)}
                            className="w-full md:w-auto"
                        >
                            Details
                        </Button>
                        <Button
                            variant="gradient"
                            color="blue"
                            size="sm"
                            disabled={!employee.isVerified || employee.totalSalary <= 0}
                            onClick={() => onPayEmployee(employee)}
                            className="w-full md:w-auto flex items-center justify-center gap-2"
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
        <Card className="w-full overflow-x-auto">
            {/* Desktop View */}
            <div className="hidden md:block">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="border-b border-neutral-200 dark:border-dark-neutral-300 bg-neutral-50 dark:bg-dark-neutral-200 p-4"
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
                            <tr
                                key={row.id}
                                className="hover:bg-neutral-50 dark:hover:bg-dark-background/50 border-b border-neutral-200 dark:border-dark-neutral-300"
                            >
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
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                {table.getRowModel().rows.map(row => (
                    <Card
                        key={row.id}
                        className="mb-4 p-4 border border-neutral-200 dark:border-dark-neutral-300"
                    >
                        {row.getVisibleCells().map(cell => (
                            <div
                                key={cell.id}
                                className="mb-2 pb-2 border-b border-neutral-200 dark:border-dark-neutral-300 last:border-b-0"
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </div>
                        ))}
                    </Card>
                ))}
            </div>

            {/* No Data State */}
            {employees.length === 0 && (
                <div className="text-center py-6">
                    <Typography variant="h6" className="text-neutral-600 dark:text-neutral-300">
                        No employees found
                    </Typography>
                </div>
            )}
        </Card>
    );
};

export default EmployeeTable;