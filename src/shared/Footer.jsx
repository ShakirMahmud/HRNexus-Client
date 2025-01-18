import React from 'react';
import { 
    Typography, 
    Button 
} from "@material-tailwind/react";
import { 
    NavLink, 
    Link 
} from 'react-router-dom';
import { 
    Facebook, 
    Github, 
    Linkedin, 
    Globe 
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            icon: <Facebook className="h-5 w-5" />,
            href: "https://www.facebook.com/shakir.mahmud.9/",
            label: "Facebook"
        },
        {
            icon: <Github className="h-5 w-5" />,
            href: "https://github.com/ShakirMahmud",
            label: "GitHub"
        },
        {
            icon: <Linkedin className="h-5 w-5" />,
            href: "https://www.linkedin.com/in/shakirmahmud9/",
            label: "LinkedIn"
        },
        {
            icon: <Globe className="h-5 w-5" />,
            href: "https://shakir-portfolio.vercel.app/",
            label: "Portfolio"
        }
    ];

    const quickLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Contact", path: "/contact" }
    ];

    const legalLinks = [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Cookie Policy", path: "/cookies" }
    ];

    return (
        <footer className="bg-neutral-50 dark:bg-dark-background text-neutral-800 dark:text-neutral-100 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="space-y-4">
                        <Typography
                            as={NavLink}
                            to="/"
                            className="cursor-pointer font-bold 
                                text-primary-600 dark:text-primary-400 
                                text-2xl flex items-center gap-2"
                        >
                            HRNexus
                        </Typography>
                        <Typography 
                            variant="paragraph" 
                            className="text-neutral-600 dark:text-neutral-300"
                        >
                            Streamline your HR processes with our comprehensive management solution.
                        </Typography>
                        
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <Typography 
                            variant="h6" 
                            className="mb-4 text-neutral-800 dark:text-white"
                        >
                            Quick Links
                        </Typography>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <NavLink
                                        to={link.path}
                                        className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <Typography 
                            variant="h6" 
                            className="mb-4 text-neutral-800 dark:text-white"
                        >
                            Legal
                        </Typography>
                        <ul className="space-y-2">
                            {legalLinks.map((link, index) => (
                                <li key={index}>
                                    <NavLink
                                        to={link.path}
                                        className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Signup */}
                    <div>
                        <Typography 
                            variant="h6" 
                            className="mb-4 text-neutral-800 dark:text-white"
                        >
                            Stay Updated
                        </Typography>
                        <div className="flex flex-col space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-neutral-300 dark:border-dark-neutral-300 rounded-md dark:bg-dark-neutral-200 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <Button
                                className="bg-primary-500 hover:bg-primary-600 dark:bg-dark-primary-500 dark:hover:bg-dark-primary-600"
                                fullWidth
                            >
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-dark-neutral-300 text-center">
                    <Typography 
                        variant="small" 
                        className="text-neutral-600 dark:text-neutral-400"
                    >
                        © {currentYear} HRNexus. All rights reserved.
                    </Typography>
                </div>
            </div>
        </footer>
    );
};

export default Footer;