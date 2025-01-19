
import { DollarSignIcon } from "lucide-react";
import {
    Card,
    Typography,
    Button,
    Chip,
} from "@material-tailwind/react";

const PayrollDesktopView = ({ payments, processingPayment, setProcessingPayment, paymentRefetch, getMonthName, handlePayEmployee }) => {
    return (
        <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="bg-neutral-50 dark:bg-dark-neutral-200">
                            {['Employee Name', 'Employee Email', 'Salary', 'Period', 'Status', 'Payment Date', 'Actions'].map((head) => (
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
                        {payments.map((payment) => {
                            const isPending = payment.status === 'pending';
                            const isProcessing = processingPayment === payment._id;

                            return (
                                <tr
                                    key={payment._id}
                                    className="hover:bg-neutral-50 dark:hover:bg-dark-neutral-300"
                                >
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Typography
                                            variant="small"
                                            className="text-neutral-800 dark:text-neutral-100"
                                        >
                                            {payment.employeeName}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Typography
                                            variant="small"
                                            className="text-neutral-800 dark:text-neutral-100"
                                        >
                                            {payment.employeeEmail}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Typography
                                            variant="small"
                                            className="font-bold flex items-center text-success-600 dark:text-success-400"
                                        >
                                            <DollarSignIcon className="h-4 w-4 mr-1" />
                                            {payment.amount}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Typography
                                            variant="small"
                                            className="text-neutral-800 dark:text-neutral-100"
                                        >
                                            {getMonthName(payment.month)} {payment.year}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={payment.status}
                                            color={
                                                payment.status === 'pending' ? 'yellow' :
                                                    payment.status === 'completed' ? 'green' : 'red'
                                            }
                                            className="dark:text-neutral-100"
                                        />
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300">
                                        <Typography
                                            variant="small"
                                            className="text-neutral-800 dark:text-neutral-100"
                                        >
                                            {payment.paymentDate
                                                ? new Date(payment.paymentDate).toLocaleDateString()
                                                : 'Not Paid'}
                                        </Typography>
                                    </td>
                                    <td className="p-4 border-b border-neutral-200 dark:border-dark-neutral-300 text-center">
                                        <Button
                                            size="sm"
                                            color="green"
                                            disabled={!isPending || isProcessing}
                                            onClick={() => handlePayEmployee(payment)}
                                            className="dark:bg-success-600 dark:hover:bg-success-500 dark:text-white"
                                        >
                                            {isProcessing ? 'Processing...' : 'Pay'}
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
    );
};

export default PayrollDesktopView;