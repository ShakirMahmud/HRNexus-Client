import React, { useState } from 'react';
import {
    Button,
    Card,
    Typography
} from "@material-tailwind/react";
import {
    UserIcon,
    BadgeCheckIcon,
    DollarSignIcon,
    TrashIcon
} from 'lucide-react';
import SalaryAdjustmentModal from './SalaryAdjustmentModal';

const EmployeeTable = ({ employees, onFireEmployee, refetch }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);

    const handleOpenSalaryModal = (employee) => {
        setSelectedEmployee(employee);
        setIsSalaryModalOpen(true);
    };

    return (
        <Card className="w-full overflow-x-auto shadow-lg">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr className="bg-blue-gray-50">
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold flex items-center">
                                <UserIcon className="mr-2 h-4 w-4" /> Name
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold flex items-center">
                                <BadgeCheckIcon className="mr-2 h-4 w-4" /> Designation
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100">
                            <Typography variant="small" color="blue-gray" className="font-bold flex items-center">
                                <DollarSignIcon className="mr-2 h-4 w-4" /> Salary
                            </Typography>
                        </th>
                        <th className="p-4 border-b border-blue-gray-100 text-center">
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                Actions
                            </Typography>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => {
                        const isHR = employee.roleValue === 'HR';
                        const salaryDisplay = isHR
                            ? `$${(employee.salaryPerHour).toFixed(2)} /month`
                            : `$${employee.salaryPerHour.toFixed(2)} /hour`;

                        return (
                            <tr
                                key={employee._id}
                                className="hover:bg-blue-gray-50 transition-colors"
                            >
                                <td className="p-4 border-b border-blue-gray-50">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={employee.image}
                                            alt={employee.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <Typography variant="small" color="blue-gray">
                                            {employee.name}
                                        </Typography>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <Typography
                                        variant="small"
                                        color={isHR ? "green" : "blue-gray"}
                                        className="font-medium"
                                    >
                                        {employee.roleValue}
                                    </Typography>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <Typography variant="small" color="blue-gray">
                                        {salaryDisplay}
                                    </Typography>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50 text-center">
                                    <div className="flex justify-center space-x-2">
                                        {!isHR && (
                                            <Button
                                                size="sm"
                                                color="blue"
                                                variant="outlined"
                                                onClick={() => {/* Logic to make HR */ }}
                                            >
                                                Make HR
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            color="red"
                                            variant="outlined"
                                            onClick={() => onFireEmployee(employee)}
                                        >
                                            <TrashIcon className="h-4 w-4 mr-1" /> Fire
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="green"
                                            onClick={() => handleOpenSalaryModal(employee)}
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