import React, { useState } from 'react';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Typography, 
    Button, 
    Avatar 
} from "@material-tailwind/react";
import { 
    UserIcon, 
    BadgeCheckIcon, 
    DollarSignIcon, 
    TrashIcon, 
    StarIcon 
} from 'lucide-react';
import SalaryAdjustmentModal from './SalaryAdjustmentModal';

const EmployeeCardGrid = ({ employees, onFireEmployee, refetch }) => {
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
                    const salaryDisplay = isHR 
                        ? `$${(employee.salaryPerHour).toFixed(2)} /month` 
                        : `$${employee.salaryPerHour.toFixed(2)} /hour`;

                    return (
                        <Card 
                            key={employee._id} 
                            className="w-full max-w-[26rem] shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <CardHeader 
                                floated={false} 
                                color="blue-gray" 
                                className="relative h-56"
                            >
                                <img
                                    src={employee.image}
                                    alt={employee.name}
                                    className="h-full w-full object-cover"
                                />
                                {isHR && (
                                    <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                                        <StarIcon className="h-5 w-5" />
                                    </div>
                                )}
                            </CardHeader>
                            <CardBody>
                                <div className="flex items-center justify-between mb-3">
                                    <Typography variant="h5" color="blue-gray" className="font-medium">
                                        {employee.name}
                                    </Typography>
                                    <Typography 
                                        color={isHR ? "green" : "blue-gray"} 
                                        className="flex items-center gap-1.5 font-normal"
                                    >
                                        <BadgeCheckIcon className="h-4 w-4" />
                                        {employee.roleValue}
                                    </Typography>
                                </div>
                                <Typography color="blue-gray" className="flex items-center gap-1.5 font-normal mb-3">
                                    <DollarSignIcon className="h-4 w-4" />
                                    {salaryDisplay}
                                </Typography>
                                <div className="flex justify-between gap-2">
                                    {!isHR && (
                                        <Button 
                                            size="sm" 
                                            variant="outlined" 
                                            color="blue"
                                            className="flex items-center gap-2"
                                            onClick={() => {/* Logic to make HR */}}
                                        >
                                            <StarIcon className="h-4 w-4" />
                                            Make HR
                                        </Button>
                                    )}
                                    <Button 
                                        size="sm" 
                                        variant="outlined" 
                                        color="red"
                                        className="flex items-center gap-2"
                                        onClick={() => onFireEmployee(employee)}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        Fire
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        color="green"
                                        className="flex items-center gap-2"
                                        onClick={() => handleOpenSalaryModal(employee)}
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