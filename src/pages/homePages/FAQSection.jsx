import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Typography,
    Input,
    Button
} from "@material-tailwind/react";
import {
    ChevronDownIcon,
    SearchIcon,
    HelpCircleIcon
} from 'lucide-react';

const FAQSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeQuestion, setActiveQuestion] = useState(null);

    const faqs = [
        {
            category: "General",
            questions: [
                {
                    question: "What services does your HR platform provide?",
                    answer: "Our platform offers comprehensive HR solutions including talent acquisition, performance management, payroll processing, and employee engagement tools."
                },
                {
                    question: "How secure is my company's data?",
                    answer: "We implement state-of-the-art security measures, including end-to-end encryption, multi-factor authentication, and regular security audits to protect your data."
                }
            ]
        },
        {
            category: "Pricing",
            questions: [
                {
                    question: "What are your pricing options?",
                    answer: "We offer flexible pricing plans tailored to businesses of all sizes, from small startups to large enterprises. Contact our sales team for a customized quote."
                },
                {
                    question: "Are there any hidden fees?",
                    answer: "No, we believe in transparent pricing. The price we quote includes all features in the selected plan with no additional hidden charges."
                }
            ]
        },
        {
            category: "Technical",
            questions: [
                {
                    question: "Is the platform easy to integrate?",
                    answer: "Yes, our platform offers seamless integration with most existing HR and business management systems through robust API connections."
                },
                {
                    question: "What kind of technical support do you provide?",
                    answer: "We offer 24/7 technical support through multiple channels including live chat, email, and phone support for all our enterprise clients."
                }
            ]
        }
    ];

    const filteredFAQs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <section className="py-16 px-4 bg-white dark:bg-dark-surface">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <Typography
                        variant="h2"
                        className="text-neutral-800 dark:text-neutral-100 mb-4 flex items-center justify-center"
                    >
                        <HelpCircleIcon className="mr-3 h-10 w-10 text-primary-500" />
                        Frequently Asked Questions
                    </Typography>
                    <Typography
                        variant="lead"
                        className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto"
                    >
                        Find answers to the most common questions about our HR management platform.
                    </Typography>
                </motion.div>

                {/* Search Input */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="relative">
                        <Input
                            icon={<SearchIcon />}
                            label="Search FAQs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="dark:bg-dark-neutral-800 dark:text-neutral-100"
                            containerProps={{
                                className: "dark:bg-dark-neutral-800"
                            }}
                        />
                    </div>
                </motion.div>

                {/* FAQ Categories */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {filteredFAQs.map((category, catIndex) => (
                        <motion.div
                            key={catIndex}
                            variants={itemVariants}
                            className="mb-8"
                        >
                            <Typography
                                variant="h4"
                                className="mb-4 text-neutral-800 dark:text-neutral-100"
                            >
                                {category.category}
                            </Typography>
                            <div className="space-y-4">
                                {category.questions.map((faq, qIndex) => (
                                    <motion.div
                                        key={qIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-gray-100 dark:bg-dark-neutral-300 rounded-lg overflow-hidden"
                                    >
                                        <div
                                            onClick={() => setActiveQuestion(activeQuestion === `${catIndex}-${qIndex}` ? null : `${catIndex}-${qIndex}`)}
                                            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-neutral-400 transition-colors"
                                        >
                                            <Typography
                                                variant="h6"
                                                className="text-neutral-800 dark:text-neutral-100"
                                            >
                                                {faq.question}
                                            </Typography>
                                            <ChevronDownIcon
                                                className={`h-6 w-6 text-neutral-600 dark:text-neutral-300 transition-transform 
                                                    ${activeQuestion === `${catIndex}-${qIndex}` ? 'rotate-180' : ''}`}
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {activeQuestion === `${catIndex}-${qIndex}` && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="p-4 bg-white dark:bg-dark-neutral-200 text-neutral-600 dark:text-neutral-300"
                                                >
                                                    {faq.answer}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Still Have Questions */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mt-12"
                >
                    <Typography
                        variant="h5"
                        className="text-neutral-800 dark:text-neutral-100 mb-4"
                    >
                        Still Have Questions?
                    </Typography>
                    <Typography
                        variant="paragraph"
                        className="text-neutral-600 dark:text-neutral-300 mb-6"
                    >
                        If you have any other questions or need further assistance, feel free to reach out to our support team.
                    </Typography>
                    <Button
                        color="blue"
                        size="lg"
                        className="dark:bg-primary-600 dark:hover:bg-primary-500"
                        onClick={() => window.location.href = '/contact'}
                    >
                        Contact Us
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;