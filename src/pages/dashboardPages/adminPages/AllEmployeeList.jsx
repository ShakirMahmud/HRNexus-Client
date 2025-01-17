import React, { useState } from 'react';
import useUsers from "../../../hooks/useUsers";
import EmployeeTable from './EmployeeTable';
import EmployeeCardGrid from './EmployeeCardGrid';
import ConfirmModal from './ConfirmModal';
import { Button } from '@material-tailwind/react';

const AllEmployeeList = () => {
    const { hrsAndEmployees, isUsersLoading, refetch } = useUsers();
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleFireEmployee = (employee) => {
        setSelectedEmployee(employee);
        setIsConfirmModalOpen(true);
    };

    const toggleViewMode = () => {
        setViewMode(prevMode => (prevMode === 'table' ? 'grid' : 'table'));
    };

    return (
        <div className="container mx-auto p-4">
            <Button color="blue" size='md' className="mb-4"  onClick={toggleViewMode}>
                Toggle to {viewMode === 'table' ? 'Card View' : 'Table View'}
            </Button>

            {viewMode === 'table' ? (
                <EmployeeTable 
                    employees={hrsAndEmployees} 
                    onFireEmployee={handleFireEmployee} 
                    refetch={refetch}
                />
            ) : (
                <EmployeeCardGrid 
                    employees={hrsAndEmployees} 
                    onFireEmployee={handleFireEmployee} 
                    refetch={refetch}
                />
            )}

            <ConfirmModal 
                isOpen={isConfirmModalOpen} 
                onClose={() => setIsConfirmModalOpen(false)} 
                employee={selectedEmployee} 
                refetch={refetch}
            />
        </div>
    );
};

export default AllEmployeeList;