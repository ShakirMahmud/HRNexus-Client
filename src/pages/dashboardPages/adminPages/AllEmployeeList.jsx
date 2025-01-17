import React, { useState } from 'react';
import useUsers from "../../../hooks/useUsers";
import EmployeeTable from './EmployeeTable';
import EmployeeCardGrid from './EmployeeCardGrid';
import ConfirmModal from './ConfirmModal';
import { Button } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AllEmployeeList = () => {
    const { hrsAndEmployees, isUsersLoading, refetch } = useUsers();
    const [viewMode, setViewMode] = useState('table'); 
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const axiosSecure = useAxiosSecure();

    const employees = hrsAndEmployees.filter(user => user.isVerified === true);

    const handleFireEmployee = (employee) => {
        setSelectedEmployee(employee);
        setIsConfirmModalOpen(true);
    };

    const toggleViewMode = () => {
        setViewMode(prevMode => (prevMode === 'table' ? 'grid' : 'table'));
    };
    const handleMakeHR = async (employee) => {
        const updatedUser = { roleValue: 'HR', salaryPerHour: 2500, designation: 'HR' };
            Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to make this employee a HR. This action cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, make HR'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await axiosSecure.put(`/users/${employee._id}`, updatedUser);
                        if (res.data.modifiedCount > 0) {
                            Swal.fire({
                                icon: 'success',
                                toast: true,
                                position: 'top',
                                showConfirmButton: false,
                                timer: 1500,
                                title: 'Employee made HR successfully',
                            });
                            refetch();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to make employee a HR.',
                            });
                        }
                    } catch (error) {
                        console.error('Error making employee a HR:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to make employee a HR.',
                        });
                    }
                }
            });
        };

    return (
        <div className="container mx-auto p-4">
            <Button color="blue" size='md' className="mb-4"  onClick={toggleViewMode}>
                Toggle to {viewMode === 'table' ? 'Card View' : 'Table View'}
            </Button>

            {viewMode === 'table' ? (
                <EmployeeTable 
                    employees={employees} 
                    onFireEmployee={handleFireEmployee} 
                    refetch={refetch}
                    handleMakeHR={handleMakeHR}
                />
            ) : (
                <EmployeeCardGrid 
                    employees={employees} 
                    onFireEmployee={handleFireEmployee} 
                    refetch={refetch}
                    handleMakeHR={handleMakeHR}
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