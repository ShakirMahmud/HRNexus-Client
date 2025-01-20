import React, { useMemo, useState } from 'react';
import {
    Button,
    Card,
    Typography,
    Tooltip
} from "@material-tailwind/react";
import {
    UserIcon,
    BadgeCheckIcon,
    DollarSignIcon,
    TrashIcon,
    BanIcon
} from 'lucide-react';
import SalaryAdjustmentModal from './SalaryAdjustmentModal';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const EmployeeTable = ({ employees, onFireEmployee, refetch, handleMakeHR }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
    const axiosSecure = useAxiosSecure();

    const handleOpenSalaryModal = (employee) => {
        setSelectedEmployee(employee);
        setIsSalaryModalOpen(true);
    };
    const sortedEmployees = useMemo(() => {
        return [...employees].sort((a, b) => {
            if (a.isFired === b.isFired) {
                return a.name.localeCompare(b.name);
            }
            return a.isFired ? 1 : -1;
        });
    }, [employees]);

    return (
        <Card className="w-full overflow-x-auto bg-white dark:bg-dark-surface shadow-lg">
            {/* Desktop View */}
            <div className="hidden md:block">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="bg-neutral-50 dark:bg-dark-neutral-200">
                            <th className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 w-1/4">
                                <Typography
                                    variant="small"
                                    className="font-bold flex items-center text-neutral-700 dark:text-neutral-300"
                                >
                                    <UserIcon className="mr-2 h-4 w-4" /> Name
                                </Typography>
                            </th>
                            <th className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 w-1/4">
                                <Typography
                                    variant="small"
                                    className="font-bold flex items-center text-neutral-700 dark:text-neutral-300"
                                >
                                    <BadgeCheckIcon className="mr-2 h-4 w-4" /> Designation
                                </Typography>
                            </th>
                            <th className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 ">
                                <Typography
                                    variant="small"
                                    className="font-bold flex items-center text-neutral-700 dark:text-neutral-300"
                                >
                                    <DollarSignIcon className="mr-2 h-4 w-4" /> Salary to Pay
                                </Typography>
                            </th>
                            <th className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 text-right ">
                                <Typography
                                    variant="small"
                                    className="font-bold text-neutral-700 dark:text-neutral-300 " 
                                >
                                    Actions
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEmployees.map((employee) => {
                            const isHR = employee.roleValue === 'HR';
                            const isFired = employee.isFired;
                            const salaryDisplay = `$${(employee.salary).toFixed(2)} /month`
                            return (
                                <tr
                                    key={employee._id}
                                    className={`hover:bg-neutral-50 dark:hover:bg-dark-neutral-300 transition-colors ${isFired ? 'opacity-50 bg-red-50 dark:bg-red-900/20' : ''}`}
                                >
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img
                                                    src={employee.image}
                                                    alt={employee.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                                {isFired && (
                                                    <div className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                                        <BanIcon className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>
                                            <Typography
                                                variant="small"
                                                className={`font-normal ${isFired
                                                        ? "text-neutral-400 dark:text-neutral-600 line-through"
                                                        : "text-neutral-800 dark:text-neutral-100"
                                                    }`}
                                            >
                                                {employee.name}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Typography
                                            variant="small"
                                            className={`font-medium ${isFired
                                                    ? "text-danger-500 dark:text-danger-400"
                                                    : (isHR
                                                        ? "text-success-600 dark:text-success-400"
                                                        : "text-neutral-800 dark:text-neutral-100")
                                                }`}
                                        >
                                            {employee.roleValue}
                                            {isFired && " (Fired)"}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Typography
                                            variant="small"
                                            className={`${isFired
                                                    ? "text-neutral-400 dark:text-neutral-600 line-through"
                                                    : "text-neutral-800 dark:text-neutral-100"
                                                }`}
                                        >
                                            {salaryDisplay}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 ">
                                        <div className="flex justify-end space-x-2 ">
                                            {!isHR && !isFired && (
                                                <Button
                                                    size="sm"
                                                    color="blue"
                                                    variant="outlined"
                                                    className="mr-2 dark:text-primary-300 dark:border-primary-300 dark:hover:bg-primary-900/20"
                                                    onClick={() => handleMakeHR(employee)}
                                                >
                                                    Make HR
                                                </Button>
                                            )}
                                            {isFired ? (
                                                <Tooltip
                                                    content="Employee has been fired"
                                                    className="dark:bg-dark-neutral-800"
                                                >
                                                    <Button
                                                        size="sm"
                                                        color="red"
                                                        variant="text"
                                                        disabled
                                                        className="mr-2 dark:text-danger-400 dark:opacity-50"
                                                    >
                                                        <BanIcon className="h-4 w-4 mr-1" /> Fired
                                                    </Button>
                                                </Tooltip>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    color="red"
                                                    variant="outlined"
                                                    className="mr-2 dark:text-danger-400 dark:border-danger-400 dark:hover:bg-danger-900/20"
                                                    onClick={() => onFireEmployee(employee)}
                                                >
                                                    <TrashIcon className="h-4 w-4 mr-1" /> Fire
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                color="green"
                                                className="dark:bg-success-600 dark:hover:bg-success-500"
                                                onClick={() => handleOpenSalaryModal(employee)}
                                                disabled={isFired}
                                            >
                                                Adjust Salary
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
                {sortedEmployees.map((employee) => {
                    const isHR = employee.roleValue === 'HR';
                    const isFired = employee.isFired;
                    const salaryDisplay = `$${(employee.salary).toFixed(2)} /month`

                    return (
                        <Card
                            key={employee._id}
                            className={`mb-4 p-4 ${isFired
                                    ? 'bg-red-50 dark:bg-red-900/20 opacity-50'
                                    : 'bg-white dark:bg-dark-neutral-200'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img
                                            src={employee.image}
                                            alt={employee.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        {isFired && (
                                            <div className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                                <BanIcon className="h-3 w-3" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Typography
                                            variant="small"
                                            className={`font-medium ${isFired
                                                    ? "text-neutral-400 dark:text-neutral-600 line-through"
                                                    : "text-neutral-800 dark:text-neutral-100"
                                                }`}
                                        >
                                            {employee.name}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className={`${isFired
                                                    ? "text-danger-500 dark:text-danger-400"
                                                    : (isHR
                                                        ? "text-success-600 dark:text-success-400"
                                                        : "text-neutral-600 dark:text-neutral-300")
                                                }`}
                                        >
                                            {employee.roleValue}
                                            {isFired && " (Fired)"}
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                                <Typography
                                    variant="small"
                                    className={`font-medium ${isFired
                                            ? "text-neutral-400 dark:text-neutral-600 line-through"
                                            : "text-neutral-800 dark:text-neutral-100"
                                        }`}
                                >
                                    Salary: {salaryDisplay}
                                </Typography>
                            </div>

                            <div className="flex flex-wrap justify-end gap-2">
                                {!isHR && !isFired && (
                                    <Button
                                        size="sm"
                                        color="blue"
                                        variant="outlined"
                                        className="mr-2 dark:text-primary-300 dark:border-primary-300 dark:hover:bg-primary-900/20"
                                        onClick={() => handleMakeHR(employee)}
                                    >
                                        Make HR
                                    </Button>
                                )}
                                {isFired ? (
                                    <Button
                                        size="sm"
                                        color="red"
                                        variant="text"
                                        disabled
                                        className="mr-2 dark:text-danger-400 dark:opacity-50"
                                    >
                                        <BanIcon className="h-4 w-4 mr-1" /> Fired
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        color="red"
                                        variant="outlined"
                                        className="mr-2 dark:text-danger-400 dark:border-danger-400 dark:hover:bg-danger-900/20"
                                        onClick={() => onFireEmployee(employee)}
                                    >
                                        <TrashIcon className="h-4 w-4 mr-1" /> Fire
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    color="green"
                                    className="dark:bg-success-600 dark:hover:bg-success-500"
                                    onClick={() => handleOpenSalaryModal(employee)}
                                    disabled={isFired}
                                >
                                    Adjust Salary
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <SalaryAdjustmentModal
                isOpen={isSalaryModalOpen}
                onClose={() => setIsSalaryModalOpen(false)}
                employee={selectedEmployee}
                refetch={refetch}
            />
        </Card>
    );
};

export default EmployeeTable;