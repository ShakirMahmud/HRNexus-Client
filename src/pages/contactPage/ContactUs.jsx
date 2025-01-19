import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Typography, 
    Input, 
    Textarea, 
    Button 
} from "@material-tailwind/react";
import { 
    MapPinIcon, 
    MailIcon, 
    PhoneIcon, 
    SendIcon 
} from 'lucide-react';

import Swal from 'sweetalert2';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const ContactUs = () => {
    const axiosPublic = useAxiosPublic();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Form',
                text: 'Please fill in all fields',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        try {
            const response = await axiosPublic.post('/contact', {
                ...formData,
                timestamp: new Date().toISOString()
            });

            if (response.data.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent Successfully!',
                    text: 'We will get back to you soon.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                });
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'Please try again later',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    return (
        <div className=" bg-white dark:bg-dark-surface py-24 px-4">
            <div className="container mx-auto grid md:grid-cols-2 gap-12">
                {/* Contact Information */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gray-100 dark:bg-dark-neutral-300 p-8 rounded-xl"
                >
                    <Typography 
                        variant="h3" 
                        className="text-neutral-800 dark:text-neutral-100 mb-6"
                    >
                        Contact Information
                    </Typography>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <MapPinIcon className="h-6 w-6 text-primary-500" />
                            <Typography className="text-neutral-600 dark:text-neutral-300">
                                123 HR Solutions Street, Business District, City, Country
                            </Typography>
                        </div>
                        <div className="flex items-center space-x-4">
                            <MailIcon className="h-6 w-6 text-primary-500" />
                            <Typography className="text-neutral-600 dark:text-neutral-300">
                                support@hrsolutions.com
                            </Typography>
                        </div>
                        <div className="flex items-center space-x-4">
                            <PhoneIcon className="h-6 w-6 text-primary-500" />
                            <Typography className="text-neutral-600 dark:text-neutral-300">
                                +1 (555) 123-4567
                            </Typography>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography 
                        variant="h3" 
                        className="text-neutral-800 dark:text-neutral-100 mb-6"
                    >
                        Send Us a Message
                    </Typography>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            name="name"
                            label="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="dark:bg-dark-neutral-800 dark:text-neutral-100"
                            containerProps={{
                                className: "dark:bg-dark-neutral-800"
                            }}
                        />
                        <Input
                            name="email"
                            type="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="dark:bg-dark-neutral-800 dark:text-neutral-100"
                            containerProps={{
                                className: "dark:bg-dark-neutral-800"
                            }}
                        />
                        <Textarea
                            name="message"
                            label="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            className="dark:bg-dark-neutral-800 dark:text-neutral-100"
                            containerProps={{
                                className: "dark:bg-dark-neutral-800"
                            }}
                        />
                        <Button 
                            type="submit" 
                            color="blue" 
                            className="flex items-center gap-2 dark:bg-primary-600 dark:hover:bg-primary-500"
                        >
                            <SendIcon className="h-4 w-4" />
                            Send Message
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactUs;