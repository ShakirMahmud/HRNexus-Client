import React from 'react';
import { motion } from 'framer-motion';
import { 
    Card, 
    CardBody, 
    Typography, 
    Button 
} from "@material-tailwind/react";
import {
    UsersIcon,
    BarChartIcon,
    ClockIcon,
    DatabaseIcon,
    ShieldCheckIcon,
    BriefcaseIcon
} from 'lucide-react';

const Services = () => {
    const servicesList = [
        {
            icon: UsersIcon,
            title: "Talent Acquisition",
            description: "Comprehensive recruitment solutions to find and attract top talent for your organization.",
            color: "text-primary-500"
        },
        {
            icon: BarChartIcon,
            title: "Performance Management",
            description: "Advanced analytics and tools to track, evaluate, and enhance employee performance.",
            color: "text-success-500"
        },
        {
            icon: ClockIcon,
            title: "Time & Attendance",
            description: "Automated tracking and management of employee work hours and attendance.",
            color: "text-blue-500"
        },
        {
            icon: DatabaseIcon,
            title: "HR Analytics",
            description: "Data-driven insights to make informed decisions about workforce management.",
            color: "text-purple-500"
        },
        {
            icon: ShieldCheckIcon,
            title: "Compliance Management",
            description: "Ensure legal compliance and mitigate risks with our comprehensive compliance solutions.",
            color: "text-danger-500"
        },
        {
            icon: BriefcaseIcon,
            title: "Payroll Management",
            description: "Streamlined payroll processing with accurate and timely salary disbursement.",
            color: "text-success-600"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 50 
        },
        visible: {
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 300
            }
        }
    };

    return (
        <section className="py-12 px-4 bg-white dark:bg-dark-surface overflow-hidden">
            <div className="container mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <Typography 
                        variant="h2" 
                        className="text-neutral-800 dark:text-neutral-100 mb-4"
                    >
                        Our HR Management Services
                    </Typography>
                    <Typography 
                        variant="lead" 
                        className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto"
                    >
                        Comprehensive solutions designed to streamline your human resources processes 
                        and drive organizational success.
                    </Typography>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {servicesList.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <Card 
                                className="group h-full flex flex-col 
                                bg-white dark:bg-dark-neutral-200 
                                border border-neutral-200 dark:border-dark-neutral-300"
                            >
                                <CardBody className="text-center flex flex-col flex-grow">
                                    <motion.div 
                                        initial={{ rotate: -10 }}
                                        whileHover={{ 
                                            rotate: 0,
                                            transition: { type: "spring", stiffness: 300 }
                                        }}
                                        className="flex justify-center mb-4"
                                    >
                                        <div 
                                            className={`p-4 rounded-full mb-4 
                                            ${service.color} 
                                            bg-opacity-10 group-hover:bg-opacity-20 
                                            transition-all duration-300`}
                                        >
                                            <service.icon 
                                                className={`h-10 w-10 ${service.color}`} 
                                            />
                                        </div>
                                    </motion.div>
                                    <Typography 
                                        variant="h5" 
                                        className="mb-2 text-neutral-800 dark:text-neutral-100"
                                    >
                                        {service.title}
                                    </Typography>
                                    <Typography 
                                        variant="paragraph" 
                                        className="mb-4 text-neutral-600 dark:text-neutral-300 flex-grow"
                                    >
                                        {service.description}
                                    </Typography>
                                    <Button 
                                        variant="outlined" 
                                        color="blue"
                                        className="dark:text-primary-300 dark:border-primary-300 dark:hover:bg-primary-900/20 self-center"
                                    >
                                        Learn More
                                    </Button>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Typography 
                        variant="paragraph" 
                        className="text-neutral-600 dark:text-neutral-300 mb-6"
                    >
                        Ready to transform your HR processes?
                    </Typography>
                    <Button 
                        color="blue" 
                        size="lg"
                        className="dark:bg-primary-600 dark:hover:bg-primary-500"
                    >
                        Get Started
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default Services;