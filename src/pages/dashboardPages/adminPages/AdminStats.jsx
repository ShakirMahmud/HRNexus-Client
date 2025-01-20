import React from 'react';
import { motion } from 'framer-motion';
import { 
    Typography, 
    Card, 
    CardBody 
} from "@material-tailwind/react";
import { 
    UsersIcon, 
    DollarSignIcon, 
    ClockIcon, 
    BarChartIcon 
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    Legend
} from 'recharts';
import UpdateProfile from '../../../components/UpdateProfile';

const AdminStats = ({ adminStats, contact }) => {
    // Role Distribution Chart
    const roleDistributionData = Object.entries(adminStats?.userRoleDistribution || {}).map(
        ([name, value]) => ({ name, value })
    );

    // Work Hours Chart
    const workHoursData = adminStats?.avgWorkHoursPerMonth?.map(item => ({
        month: `${item.month}/${item.year}`,
        hours: item.avgHoursPerEmployee
    })) || [];

    // Top Working Employees
    const topEmployeesData = adminStats?.topWorkingEmployees?.map(emp => ({
        email: emp.email.split('@')[0],
        hours: emp.totalHours
    })) || [];

    // Payment Trends
    const paymentTrendsData = adminStats?.monthlyPaymentTrends?.map(trend => ({
        month: `${trend.month}/${trend.year}`,
        amount: trend.totalPaid
    })) || [];

    const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* Profile and Quick Stats */}
            <div className="md:col-span-2 lg:col-span-1">
                <UpdateProfile />
                
                {/* Quick Stat Cards */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    {/* Total Users */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 text-center"
                    >
                        <UsersIcon className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                        <Typography variant="h6" className="text-primary-600">
                            Total Users
                        </Typography>
                        <Typography variant="h4" className="text-primary-800 dark:text-primary-200">
                            {Object.values(adminStats?.userRoleDistribution || {}).reduce((a, b) => a + b, 0)}
                        </Typography>
                    </motion.div>

                    {/* Total Salary Paid */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-success-50 dark:bg-dark-neutral-100 rounded-xl p-4 text-center"
                    >
                        <DollarSignIcon className="h-8 w-8 text-success-500 mx-auto mb-2" />
                        <Typography variant="h6" className="text-success-600">
                            Total Paid
                        </Typography>
                        <Typography variant="h4" className="text-success-800 dark:text-primary-200">
                            ${adminStats?.salaryStats?.completed?.totalAmount || 0}
                        </Typography>
                    </motion.div>
                </div>
            </div>

            {/* Role Distribution Pie Chart */}
            <Card className="overflow-hidden dark:bg-dark-neutral-200">
                <CardBody className=''>
                    <Typography variant="h6" className="mb-4 dark:text-neutral-300">
                        Role Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={500}>
                        <PieChart>
                            <Pie
                                data={roleDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {roleDistributionData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            {/* Work Hours Bar Chart */}
            <Card className="overflow-hidden dark:bg-dark-neutral-200">
                <CardBody>
                    <Typography variant="h6" className="mb-4 dark:text-neutral-300">
                        Avg Work Hours per Month
                    </Typography>
                    <ResponsiveContainer width="100%" height={500} className='dark:text-neutral-50'>
                        <BarChart data={workHoursData} >
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="hours" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            {/* Top Working Employees */}
            <Card className="overflow-hidden dark:bg-dark-neutral-200">
                <CardBody>
                    <Typography variant="h6" className="mb-4 dark:text-neutral-300">
                        Top Working Employees
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topEmployeesData}>
                            <XAxis dataKey="email" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="hours" fill="#6366f1" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            {/* Payment Trends */}
            <Card className="overflow-hidden dark:bg-dark-neutral-200">
                <CardBody>
                    <Typography variant="h6" className="mb-4 dark:text-neutral-300">
                        Monthly Payment Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={paymentTrendsData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#f43f5e" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            {/* Recent Contact Messages */}
            <Card className="md:col-span-2 lg:col-span-3 dark:bg-dark-neutral-200">
                <CardBody>
                    <Typography variant="h6" className="mb-4 dark:text-neutral-300">
                        Recent Contact Messages
                    </Typography>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contact?.slice(0, 3).map((msg, index) => (
                            <motion.div 
                                key={msg._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-neutral-100 dark:bg-dark-neutral-300 rounded-xl p-4"
                            >
                                <Typography variant="small" className="font-bold dark:text-neutral-50">
                                    {msg.name}
                                </Typography>
                                <Typography variant="small" className="text-neutral-600 dark:text-neutral-200">
                                    {msg.email}
                                </Typography>
                                <Typography variant="paragraph" className="mt-2 dark:text-neutral-50">
                                    {msg.                                    message.length > 100 
                                        ? `${msg.message.slice(0, 100)}...` 
                                        : msg.message
                                }
                                </Typography>
                                <Typography 
                                    variant="small" 
                                    className="text-neutral-500 mt-2 text-right dark:text-neutral-200"
                                >
                                    {new Date(msg.timestamp).toLocaleDateString()}
                                </Typography>
                            </motion.div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default AdminStats;