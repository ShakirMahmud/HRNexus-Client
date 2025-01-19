import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Avatar,
    Tooltip
} from "@material-tailwind/react";
import {
    UserIcon,
    BadgeCheckIcon,
    DollarSignIcon,
    TrashIcon,
    StarIcon,
    BanIcon
} from 'lucide-react';
import SalaryAdjustmentModal from './SalaryAdjustmentModal';


const EmployeeCardGrid = ({ employees, onFireEmployee, refetch, handleMakeHR }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
    

    const handleOpenSalaryModal = (employee) => {
        setSelectedEmployee(employee);
        setIsSalaryModalOpen(true);
    };


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(employee => {
                    const isHR = employee.roleValue === 'HR';
                    const isFired = employee.isFired;
                    const salaryDisplay = isHR
                        ? `$${(employee.salaryPerHour).toFixed(2)} /month`
                        : `$${employee.salaryPerHour.toFixed(2)} /hour`;
    
                    return (
                        <Card
                            key={employee._id}
                            className={`w-full max-w-[26rem] shadow-lg hover:shadow-xl transition-all duration-300 
                                bg-white dark:bg-dark-neutral-200 
                                ${isFired ? 'opacity-50 bg-red-50 dark:bg-red-900/20' : ''}`}
                        >
                            <CardHeader
                                floated={false}
                                color="blue-gray"
                                className="relative h-56"
                            >
                                <div className="relative h-full w-full">
                                    <img
                                        src={employee.image}
                                        alt={employee.name}
                                        className="h-full w-full object-cover"
                                    />
                                    {isFired && (
                                        <div className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                            <BanIcon className="h-5 w-5" />
                                        </div>
                                    )}
                                    {isHR && !isFired && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                                            <StarIcon className="h-5 w-5" />
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="flex items-center justify-between mb-3">
                                    <Typography
                                        variant="h5"
                                        className={`font-medium ${
                                            isFired 
                                            ? "text-danger-500 dark:text-danger-400 line-through" 
                                            : "text-neutral-800 dark:text-neutral-100"
                                        }`}
                                    >
                                        {employee.name}
                                    </Typography>
                                    <Typography
                                        className={`flex items-center gap-1.5 font-normal ${
                                            isFired 
                                            ? "text-danger-500 dark:text-danger-400" 
                                            : (isHR 
                                                ? "text-success-600 dark:text-success-400" 
                                                : "text-neutral-700 dark:text-neutral-300")
                                        }`}
                                    >
                                        <BadgeCheckIcon className="h-4 w-4" />
                                        {employee.roleValue}
                                        {isFired && " (Fired)"}
                                    </Typography>
                                </div>
                                <Typography
                                    className={`flex items-center gap-1.5 font-normal mb-3 ${
                                        isFired 
                                        ? "text-neutral-400 dark:text-neutral-600 line-through" 
                                        : "text-neutral-800 dark:text-neutral-100"
                                    }`}
                                >
                                    <DollarSignIcon className="h-4 w-4" />
                                    {salaryDisplay}
                                </Typography>
                                <div className="flex flex-col sm:flex-row justify-between gap-2">
                                    {!isHR && !isFired && (
                                        <Button
                                            size="sm"
                                            variant="outlined"
                                            color="blue"
                                            className="w-full sm:w-auto flex items-center gap-2 
                                                dark:text-primary-300 dark:border-primary-300 dark:hover:bg-primary-900/20"
                                            onClick={() => { handleMakeHR(employee) }}
                                        >
                                            <StarIcon className="h-4 w-4" />
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
                                                className="w-full sm:w-auto flex items-center gap-2 
                                                    dark:text-danger-400 dark:opacity-50"
                                            >
                                                <BanIcon className="h-4 w-4" />
                                                Fired
                                            </Button>
                                        </Tooltip>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outlined"
                                            color="red"
                                            className="w-full sm:w-auto flex items-center gap-2
                                                dark:text-danger-400 dark:border-danger-400 dark:hover:bg-danger-900/20"
                                            onClick={() => onFireEmployee(employee)}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            Fire
                                        </Button>
                                    )}
    
                                    <Button
                                        size="sm"
                                        color="green"
                                        className="w-full sm:w-auto flex items-center gap-2
                                            dark:bg-success-600 dark:hover:bg-success-500"
                                        onClick={() => handleOpenSalaryModal(employee)}
                                        disabled={isFired}
                                    >
                                        <DollarSignIcon className="h-4 w-4" />
                                        Adjust
                                    </Button>
                                </div>
                            </CardBody>
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
        </>
    );
};

export default EmployeeCardGrid;