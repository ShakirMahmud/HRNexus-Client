import React, { useMemo, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import {
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';
import {
    Card,
    Typography,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option
} from "@material-tailwind/react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useHR from "../../../hooks/useHR";
import { X, Check, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';
import useUsers from '../../../hooks/useUsers';

// Predefined Designations
const DESIGNATIONS = [
    'Sales Assistant',
    'Social Media Executive',
    'Digital Marketer',
    'Content Writer',
    'HR Coordinator',
    'Customer Support Specialist'
];

const EmployeeList = () => {
    const { isHR } = useHR();
    const axiosSecure = useAxiosSecure();
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const { hrsAndEmployees, isUsersLoading, refetch } = useUsers();

    // Designation Change Handler
    const handleDesignationChange = async (employee, designation) => {
        const updatedUser = { designation: designation };
        try {
            await axiosSecure.put(`/users/${employee._id}`, updatedUser)
                .then(res => {
                    if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            icon: 'success',
                            toast: true,
                            position: 'top',
                            showConfirmButton: false,
                            timer: 1500,
                            title: 'Designation Updated',
                            text: `${employee.name}'s designation has been updated to ${designation}`
                        });
                        refetch();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            toast: true,
                            position: 'top',
                            title: 'Designation Not Updated',
                            text: `Designation for ${employee.name} could not be updated`
                        })
                    }
                })
        } catch (error) {
            console.error(error);
        }
    }
    const handleToggleVerification = async (employee) => {
        // Check if designation is set
        if (!employee.designation) {
            Swal.fire({
                icon: 'warning',
                toast: true,
                position: 'top',
                showConfirmButton: false,
                timer: 1500,
                title: 'Designation Required',
                text: 'Please set a designation before verifying the employee'
            });
            return;
        }

        const updatedUser = { isVerified: !employee.isVerified };
        try {
            await axiosSecure.put(`/users/${employee._id}`, updatedUser)
                .then(res => {
                    if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            icon: 'success',
                            toast: true,
                            position: 'top',
                            showConfirmButton: false,
                            timer: 1500,
                            title: 'Verification Status Updated',
                            text: `${employee.name}'s verification status has been updated to ${employee.isVerified ? 'Not Verified' : 'Verified'}`
                        });
                        refetch();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            toast: true,
                            position: 'top',
                            title: 'Verification Status Not Updated',
                            text: `Verification status for ${employee.name} could not be updated`
                        })
                    }
                })
        } catch (error) {
            console.error(error);
        }
    };

    // Pay Employee Handler
    const handlePayEmployee = (employee) => {
        if (!employee.isVerified) {
            Swal.fire({
                icon: 'warning',
                title: 'Cannot Process Payment',
                text: 'Only verified employees can be paid'
            });
            return;
        }

        setSelectedEmployee(employee);
        setIsPayModalOpen(true);
    };

    // Columns Definition
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
                            onChange={(value) => handleDesignationChange(employee, value)}
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
                            onChange={(value) => handleDesignationChange(employee, value)}
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
                        onClick={() => handleToggleVerification(employee)}
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
            accessorKey: 'salary',
            cell: info => `$${info.getValue() || 0}`
        },
        {
            header: 'Actions',
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <Button
                        variant="gradient"
                        color="blue"
                        disabled={!employee.isVerified}
                        onClick={() => handlePayEmployee(employee)}
                        className="flex items-center gap-2"
                    >
                        <DollarSign className="h-4 w-4" />
                        Pay
                    </Button>
                );
            }
        }
    ], []);

    // Create Table Instance
    const table = useReactTable({
        data: hrsAndEmployees,
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

            {/* <PayModal /> */}
        </Card>
    );
};

export default EmployeeList;