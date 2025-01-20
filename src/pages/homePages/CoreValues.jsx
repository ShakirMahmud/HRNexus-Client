import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Button } from '@material-tailwind/react';
import { TargetIcon, GlobeIcon, UsersIcon, StarIcon, AwardIcon } from 'lucide-react';

const CoreValues = () => {
    const values = [
        {
            icon: TargetIcon,
            title: "Precision",
            description: "Delivering accurate and data-driven HR solutions with meticulous attention to detail.",
            color: "text-primary-500"
        },
        {
            icon: GlobeIcon,
            title: "Innovation",
            description: "Continuously evolving our approaches to meet the dynamic needs of modern workplaces.",
            color: "text-success-500"
        },
        {
            icon: UsersIcon,
            title: "People-Centric",
            description: "Putting human potential at the core of every solution we develop.",
            color: "text-blue-500"
        },
        {
            icon: StarIcon,
            title: "Excellence",
            description: "Committed to delivering exceptional service and transformative HR strategies.",
            color: "text-purple-500"
        },
        {
            icon: AwardIcon,
            title: "Integrity",
            description: "Maintaining the highest standards of ethical practice and professional conduct.",
            color: "text-danger-500"
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

    const itemVariants = {
        hidden: { 
            y: 50, 
            opacity: 0 
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        hover: {
            scale: 1.05,
            rotate: 2,
            transition: {
                type: "spring",
                stiffness: 300
            }
        }
    };

    return (
        <section className="py-16 px-4 bg-white dark:bg-dark-surface">
            <div className="container mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <Typography 
                        variant="h2" 
                        className="text-neutral-800 dark:text-neutral-100 mb-4"
                    >
                        Our Commitment to Excellence
                    </Typography>
                    <Typography 
                        variant="lead" 
                        className="text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto"
                    >
                        We are dedicated to transforming workplace potential through innovative, 
                        people-focused HR solutions that drive organizational success.
                    </Typography>
                </motion.div>

                {/* Values Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
                >
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover="hover"
                            className="group flex flex-col h-full" 
                        >
                            <div className="bg-gray-100 dark:bg-dark-neutral-300 p-6 rounded-xl shadow-lg text-center flex-grow transition-all duration-300 hover:shadow-xl">
                                <div className="flex justify-center mb-4">
                                    <div 
                                        className={`p-4 rounded-full mb-4 
                                        ${value.color} 
                                        bg-opacity-10 group-hover:bg-opacity-20 
                                        transition-all duration-300 flex justify-center`}
                                    >
                                        <value.icon 
                                            className={`h-10 w-10 ${value.color}`} 
                                        />
                                    </div>
                                </div>
                                <Typography 
                                    variant="h5" 
                                    className="mb-2 text-neutral-800 dark:text-neutral-100"
                                >
                                    {value.title}
                                </Typography>
                                <Typography 
                                    variant="paragraph" 
                                    className="text-neutral-600 dark:text-neutral-300"
                                >
                                    {value.description}
                                </Typography>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to Action */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <Button 
                        color="blue" 
                        size="lg"
                        className="dark:bg-primary-600 dark:hover:bg-primary-500"
                    >
                        Learn More About Our Mission
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default CoreValues;