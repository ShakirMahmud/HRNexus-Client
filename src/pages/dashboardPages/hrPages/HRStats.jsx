import React from 'react';
import { motion } from 'framer-motion';
import {
    Typography,
    Card,
    CardBody,
    Spinner
} from "@material-tailwind/react";
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
import {
    ClockIcon,
    UserIcon,
    BarChartIcon,
    ListIcon,
    AlertTriangleIcon
} from 'lucide-react';
import UpdateProfile from "../../../components/UpdateProfile";
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const HRStats = ({ hrStats, isLoading, error }) => {
    // Handle loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-screen">
                <Spinner className="h-12 w-12 text-primary-500" />
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-full min-h-screen p-6">
                <AlertTriangleIcon className="h-16 w-16 text-danger-500 mb-4" />
                <Typography variant="h4" className="text-danger-600 mb-2">
                    Error Loading Stats
                </Typography>
                <Typography variant="paragraph" className="text-neutral-600 text-center">
                    {error.message || 'Unable to fetch HR statistics'}
                </Typography>
            </div>
        );
    }

    // Handle empty or undefined stats
    if (!hrStats || Object.keys(hrStats).length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-full min-h-screen p-6">
                <AlertTriangleIcon className="h-16 w-16 text-warning-500 mb-4" />
                <Typography variant="h4" className="text-warning-600 mb-2">
                    No Statistics Available
                </Typography>
                <Typography variant="paragraph" className="text-neutral-600 text-center">
                    There are currently no statistics to display.
                </Typography>
            </div>
        );
    }

    // Prepare data for charts with safe fallbacks
    const taskTypeData = (hrStats.taskTypeDistribution || []).map(task => ({
        name: task._id || 'Unknown',
        hours: task.totalHours || 0
    }));

    const monthlyWorkTrendData = (hrStats.monthlyWorkTrend || []).map(trend => ({
        month: trend._id
            ? `${trend._id.month}/${trend._id.year}`
            : 'Unknown',
        hours: trend.totalHours || 0
    }));

    const topPerformers = (hrStats.employeePerformanceRanking?.topPerformers || [])
        .slice(0, 5) // Limit to top 5
        .map(performer => ({
            name: performer.name || 'Unknown Employee',
            email: performer.email || '',
            hours: performer.totalHours || 0,
            designation: performer.designation || 'N/A'
        }));

    const CHART_COLORS = [
        '#0091E6',  // Primary
        '#10B981',  // Success
        '#EF4444',  // Danger
        '#F59E0B',  // Warning
        '#8B5CF6'   // Purple
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 
            bg-neutral-50 dark:bg-dark-neutral-50 
            text-neutral-900 dark:text-dark-text-primary 
            transition-colors duration-300">

            {/* Profile and Quick Stats */}
            <div className="md:col-span-2 lg:col-span-1">
                <UpdateProfile />

                {/* Quick Stat Cards */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    {/* Total Work Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary-100 dark:bg-dark-neutral-200 
                            rounded-xl p-4 text-center 
                            shadow-md hover:shadow-lg transition-shadow"
                    >
                        <ClockIcon className="h-8 w-8 text-primary-500 dark:text-dark-primary-500 mx-auto mb-2" />
                        <Typography
                            variant="h6"
                            className="text-primary-600 dark:text-dark-primary-800"
                        >
                            Total Hours
                        </Typography>
                        <Typography
                            variant="h4"
                            className="text-primary-800 dark:text-dark-primary-800"
                        >
                            {(hrStats.monthlyWorkTrend || [])
                                .reduce((sum, trend) => sum + (trend.totalHours || 0), 0)}
                        </Typography>
                    </motion.div>

                    {/* Total Employees */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-success-50 dark:bg-dark-neutral-200 
                            rounded-xl p-4 text-center 
                            shadow-md hover:shadow-lg transition-shadow"
                    >
                        <UserIcon className="h-8 w-8 text-success-500 dark:text-dark-primary-800 mx-auto mb-2" />
                        <Typography
                            variant="h6"
                            className="text-success-600 dark:text-dark-primary-800"
                        >
                            Employees
                        </Typography>
                        <Typography
                            variant="h4"
                            className="text-success-800 dark:text-dark-primary-800"
                        >
                            {topPerformers.length}
                        </Typography>
                    </motion.div>
                </div>
            </div>

            {/* Task Type Distribution */}
            <Card className="overflow-hidden bg-white dark:bg-dark-neutral-200 shadow-md">
                <CardBody>
                    <Typography
                        variant="h6"
                        className="mb-4 flex items-center 
                        text-primary-600 dark:text-dark-primary-400"
                    >
                        <BarChartIcon className="mr-2" />
                        Task Type Distribution
                    </Typography>
                    {taskTypeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={500}>
                            <PieChart>
                                <Pie
                                    data={taskTypeData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="hours"
                                >
                                    {taskTypeData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="bottom"
                                    align="center"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex justify-center items-center h-48">
                            <Typography
                                variant="paragraph"
                                className="text-neutral-500 text-center"
                            >
                                No task distribution data available
                            </Typography>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Monthly Work Trend */}
            <Card className="overflow-hidden bg-white dark:bg-dark-neutral-200 shadow-md">
                <CardBody>
                    <Typography
                        variant="h6"
                        className="mb-4 flex items-center 
                                            text-success-600 dark:text-dark-primary-400"
                    >
                        <BarChartIcon className="mr-2" />
                        Monthly Work Trend
                    </Typography>
                    {monthlyWorkTrendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={monthlyWorkTrendData}>
                                <XAxis
                                    dataKey="month"
                                    className="text-xs dark:text-dark-text-secondary"
                                />
                                <YAxis
                                    className="text-xs dark:text-dark-text-secondary"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgb(var(--tw-color-neutral-100))',
                                        borderColor: 'rgb(var(--tw-color-success-500))'
                                    }}
                                />
                                <Bar
                                    dataKey="hours"
                                    fill="#10B981"
                                    className="transition-all duration-300 hover:opacity-80"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex justify-center items-center h-48">
                            <Typography
                                variant="paragraph"
                                className="text-neutral-500 text-center"
                            >
                                No monthly work trend data available
                            </Typography>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Top Performers */}
            <Card className="overflow-hidden bg-white dark:bg-dark-neutral-200 shadow-md">
                <CardBody>
                    <Typography
                        variant="h6"
                        className="mb-4 flex items-center 
                                            text-primary-600 dark:text-dark-primary-400"
                    >
                        <ListIcon className="mr-2" />
                        Top Performers
                    </Typography>
                    {topPerformers.length > 0 ? (
                        <div className="space-y-4">
                            {topPerformers.map((performer, index) => (
                                <motion.div
                                    key={performer.email}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center justify-between 
                                                            bg-neutral-100 dark:bg-dark-neutral-100 
                                                            p-3 rounded-xl 
                                                            hover:bg-neutral-200 dark:hover:bg-dark-neutral-800 
                                                            transition-colors"
                                >
                                    <div>
                                        <Typography
                                            variant="small"
                                            className="font-bold text-neutral-800 dark:text-dark-text-primary"
                                        >
                                            {performer.name}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            className="text-neutral-600 dark:text-dark-text-secondary"
                                        >
                                            {performer.designation}
                                        </Typography>
                                    </div>
                                    <div
                                        className="bg-success-50 dark:bg-success-900/20 
                                                            text-success-600 dark:text-success-400 
                                                            px-2 py-1 rounded-full text-xs font-semibold"
                                    >
                                        {performer.hours} hrs
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-48">
                            <Typography
                                variant="paragraph"
                                className="text-neutral-500 text-center"
                            >
                                No top performers data available
                            </Typography>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default HRStats;
