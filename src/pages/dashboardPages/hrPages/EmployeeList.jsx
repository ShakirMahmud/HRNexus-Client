import React, { useMemo, useState } from 'react';
import EmployeeTable from './EmployeeTable';
import CheckoutModal from './CheckoutModal';
import useUsers from '../../../hooks/useUsers';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import PaymentProcessing from './PaymentProcessing';


const EmployeeListPage = () => {
    // const { isHR } = useHR();
    const axiosSecure = useAxiosSecure();
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const { hrsAndEmployees, isUsersLoading, refetch } = useUsers();
    const navigate = useNavigate();

    const totalSalaries = hrsAndEmployees.map((employee) => ({
        _id: employee.email, 
        totalSalary: employee.salary || 0,
    })) 
    
    const handleDesignationChange = async (employee, designation) => {
        const DESIGNATION_RATES = {
            'Social Media Executive': 2000,
            'Sales Assistant': 2500,
            'Digital Marketer': 3000,
            'Content Writer': 2200,
            'Software Developer': 4000,
            'Graphic Designer': 3500,
            'Customer Support Specialist': 2000
        };
        const updatedUser = { designation: designation, salary: DESIGNATION_RATES[designation] };
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
                        // refetchTotalSalaries();
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
            if (employee.roleValue === 'HR') {
                handleDesignationChange(employee, 'HR');
            }
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
        setIsCheckoutModalOpen(true);

    };

    const navigateToEmployeeDetails = (employee) => {
        // console.log(employee)
        navigate(`/dashboard/employee-details/${employee._id}`, {
            state: { employee }
        })
    };

    return (
        <div className="container mx-auto p-4">
            <EmployeeTable
                employees={hrsAndEmployees}
                totalSalaries={totalSalaries}
                onDesignationChange={handleDesignationChange}
                onToggleVerification={handleToggleVerification}
                onPayEmployee={handlePayEmployee}
                onShowDetails={navigateToEmployeeDetails}
            // onInitiateCheckout={navigateToCheckout}
            />
            {/* {isCheckoutModalOpen && (
                <Elements stripe={stripePromise}>
                    <CheckoutModal
                        employee={selectedEmployee}
                        isOpen={isCheckoutModalOpen}
                        onClose={() => setIsCheckoutModalOpen(false)}
                    />
                </Elements>
            )} */}
            {isCheckoutModalOpen && (
                
                    <PaymentProcessing
                        employee={selectedEmployee}
                        isOpen={isCheckoutModalOpen}
                        onClose={() => setIsCheckoutModalOpen(false)}
                    />
               
            )}
        </div>
    );
};

export default EmployeeListPage;