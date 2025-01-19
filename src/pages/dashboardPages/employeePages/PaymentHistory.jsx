import React, { useState, useMemo } from 'react';
import {
    Card,
    Typography,
    Chip,
    Button,
    Alert
} from "@material-tailwind/react";
import {
    CalendarIcon,
    DollarSignIcon,
    ClockIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from 'lucide-react';
import useAuth from "../../../hooks/useAuth";
import usePayment from "../../../hooks/usePayment";

const PaymentHistory = () => {
    const { user } = useAuth();
    const { payments, paymentLoading } = usePayment(user?.email);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Group payments by year and month
    const groupedPayments = useMemo(() => {
        if (!payments) return {};

        const grouped = payments.reduce((acc, payment) => {
            const key = `${payment.year}-${payment.month}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(payment);
            return acc;
        }, {});

        return Object.entries(grouped)
            .sort(([a], [b]) => {
                const [aYear, aMonth] = a.split('-').map(Number);
                const [bYear, bMonth] = b.split('-').map(Number);
                return bYear - aYear || bMonth - aMonth;
            })
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
    }, [payments]);

    // Pagination logic
    const sortedGroupKeys = Object.keys(groupedPayments);
    const paginatedKeys = sortedGroupKeys.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Month name converter
    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    };

    // Render mobile card view
    const renderMobileView = () => {
        if (paymentLoading) {
            return (
                <div className="text-center py-4">
                    <Typography className="text-neutral-700 dark:text-neutral-300">
                        Loading payment history...
                    </Typography>
                </div>
            );
        }
    
        if (!payments || payments.length === 0) {
            return (
                <Alert 
                    color="blue" 
                    className="text-center bg-blue-50 dark:bg-dark-primary-900/20 text-blue-800 dark:text-dark-primary-300"
                >
                    No payment history available.
                </Alert>
            );
        }

        return paginatedKeys.flatMap((key) => {
            const [year, month] = key.split('-').map(Number);
            const monthPayments = groupedPayments[key];

            return [
                // Month Header
                <div
                    key={`header-${key}`}
                    className="bg-primary-50 dark:bg-dark-primary-900/20 p-3 flex items-center"
                >
                    <CalendarIcon className="mr-2 h-5 w-5 text-primary-500" />
                    <Typography variant="h6" className="text-primary-600 dark:text-primary-300">
                        {getMonthName(month)} {year}
                    </Typography>
                </div>,

                // Payment Cards
                ...monthPayments.map((payment) => (
                    <Card
                        key={payment._id}
                        className="mb-4 p-4 border border-neutral-200 dark:border-dark-neutral-300 dark:bg-dark-neutral-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <Typography variant="small" className="font-bold dark:text-dark-primary-900">
                                {getMonthName(payment.month)} {payment.year}
                            </Typography>
                            <Chip
                                variant="ghost"
                                size="sm"
                                className='dark:text-dark-primary-900'
                                value={payment.status}
                                icon={
                                    payment.status === 'pending'
                                        ? <ClockIcon className="h-4 w-4" />
                                        : <CheckCircleIcon className="h-4 w-4" />
                                }
                                color={
                                    payment.status === 'pending' ? 'yellow' :
                                        payment.status === 'completed' ? 'green' : 'red'
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Typography variant="small" className="text-neutral-600 dark:text-neutral-300 font-medium">
                                    Amount:
                                </Typography>
                                <Typography
                                    variant="small"
                                    color="green"
                                    className="font-bold flex items-center"
                                >
                                    <DollarSignIcon className="h-4 w-4 mr-1" />
                                    {payment.amount}
                                </Typography>
                            </div>


                            <div>
                                <Typography variant="small" className="text-neutral-600 dark:text-neutral-300 font-medium">
                                    Transaction ID:
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="break-words w-full max-w-full line-clamp-2 overflow-hidden text-ellipsis dark:text-dark-primary-900"
                                >
                                    {payment.transactionId}
                                </Typography>
                            </div>


                            <div>
                                <Typography variant="small" className="text-neutral-600 dark:text-neutral-300 font-medium">
                                    Paid Date:
                                </Typography>
                                <Typography variant="small" className='dark:text-dark-primary-900'>
                                    {payment.paymentDate
                                        ? new Date(payment.paymentDate).toLocaleDateString()
                                        : 'N/A'}
                                </Typography>
                            </div>
                        </div>
                    </Card>
                ))
            ];
        });
    };

    // Render desktop table view
    const renderDesktopView = () => {
        if (paymentLoading) {
            return (
                <tr>
                    <td colSpan="5" className="text-center py-4">
                        <Typography className="text-neutral-700 dark:text-neutral-300">
                            Loading payment history...
                        </Typography>
                    </td>
                </tr>
            );
        }
    
        if (!payments || payments.length === 0) {
            return (
                <tr>
                    <td colSpan="5">
                        <Alert 
                            color="blue" 
                            className="text-center bg-blue-50 dark:bg-dark-primary-900/20 text-blue-800 dark:text-dark-primary-300"
                        >
                            No payment history available.
                        </Alert>
                    </td>
                </tr>
            );
        }

        return paginatedKeys.map((key) => {
            const [year, month] = key.split('-').map(Number);
            const monthPayments = groupedPayments[key];

            return (
                <React.Fragment key={key}>
                    <tr className="bg-primary-50 dark:bg-dark-primary-900/20">
                        <td colSpan="5" className="p-3">
                            <Typography variant="small" className="font-bold flex items-center text-primary-600 dark:text-primary-300">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {getMonthName(month)} {year}
                            </Typography>
                        </td>
                    </tr>
                    {monthPayments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-neutral-50 dark:hover:bg-dark-background/50">
                            <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 dark:text-dark-primary-900">
                                <Typography variant="small">
                                    {getMonthName(payment.month)} {payment.year}
                                </Typography>
                            </td>
                            <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                <Typography
                                    variant="small"
                                    color="green"
                                    className="font-bold flex items-center"
                                >
                                    <DollarSignIcon className="h-4 w-4 mr-1" />
                                    {payment.amount}
                                </Typography>
                            </td>
                            <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 dark:text-dark-primary-900">
                                <Typography
                                    variant="small"
                                    className="break-words w-full max-w-[150px] line-clamp-2 overflow-hidden text-ellipsis"
                                >
                                    {payment.transactionId}
                                </Typography>
                            </td>
                            <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 dark:text-dark-primary-900">
                                <Chip
                                    variant="ghost"
                                    size="sm"
                                    className='dark:text-dark-primary-900'
                                    value={payment.status}
                                    icon={
                                        payment.status === 'pending'
                                            ? <ClockIcon className="h-4 w-4 dark:text-dark-primary-900" />
                                            : <CheckCircleIcon className="h-4 w-4 dark:text-dark-primary-900" />
                                    }
                                    color={
                                        payment.status === 'pending' ? 'yellow' :
                                            payment.status === 'completed' ? 'green' : 'red'
                                    }
                                />
                            </td>
                            <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 dark:text-dark-primary-900">
                                <Typography variant="small">
                                    {payment.paymentDate
                                        ? new Date(payment.paymentDate).toLocaleDateString()
                                        : 'N/A'}
                                </Typography>
                            </td>
                        </tr>
                    ))}
                </React.Fragment>
            );
        });
    };

    // Pagination Controls
    const PaginationControls = () => {
        const totalPages = Math.ceil(sortedGroupKeys.length / itemsPerPage);

        return (
            <div className="flex justify-center items-center gap-4 mt-4">
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-2"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                </Button>
                <Typography color="blue-gray" className="font-normal">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </Typography>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-2"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        );
    };

    return (
        <Card className="w-full bg-white dark:bg-dark-surface shadow-sm dark:shadow-dark-elevated">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="bg-neutral-50 dark:bg-dark-neutral-200">
                            {['Period', 'Amount', 'Transaction ID', 'Status', 'Paid Date'].map((head) => (
                                <th
                                    key={head}
                                    className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300"
                                >
                                    <Typography
                                        variant="small"
                                        className="font-bold text-neutral-700 dark:text-neutral-300"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {renderDesktopView()}
                    </tbody>
                </table>
            </div>
    
            {/* Mobile Card View */}
            <div className="md:hidden">
                <div className="space-y-4 p-4">
                    {renderMobileView()}
                </div>
            </div>
    
            {/* Pagination */}
            {payments && payments.length > itemsPerPage && (
                <div className="bg-neutral-50 dark:bg-dark-neutral-200 p-4">
                    <PaginationControls />
                </div>
            )}
        </Card>
    );
};

export default PaymentHistory;