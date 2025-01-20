import React, { useState } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
    Select,
    Option
} from "@material-tailwind/react";
import {
    EyeIcon,
    EyeOffIcon,
    UserIcon,
    MailIcon,
    Banknote,
    Lock,
    LockIcon
} from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import RoleSelectionModal from "./RoleSelectionModal";
import useGoogleSignIn from "../../hooks/useGoogleSignIn";
import img from '../../assets/signup-animation.json'
import Lottie from "lottie-react";

const Register = () => {
    const { createUser, setUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const [selectedRole, setSelectedRole] = useState('Employee');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        capital: false,
        specialChar: false
    });

    const { handleGoogleSignIn } = useGoogleSignIn();

    // Password validation
    const validatePassword = (password) => {
        const errors = {
            length: password.length < 6,
            capital: !/[A-Z]/.test(password),
            specialChar: !/[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        setPasswordErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const email = form.email.value.toLowerCase();
        const bank_account_no = form.bank_account_no.value;
        const password = form.password.value;
        const imageFile = form.image.files[0];
        const roleValue = selectedRole;

        // Validate password before submission
        if (!validatePassword(password)) {
            return;
        }

        try {
            // Image handling
            let imageUrl = generateInitialAvatar(name);
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);
                const imageResponse = await axiosPublic.post(IMAGE_HOSTING_API, imageFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (imageResponse.data.success) {
                    imageUrl = imageResponse.data.data.url;
                }
            }

            const userCredential = await createUser(email, password)
            const user = userCredential.user;
            setUser(user);
            await updateUserProfile({
                displayName: name,
                photoURL: imageUrl
            });

            const userData = {
                name,
                email,
                roleValue,
                image: imageUrl,
                bank_account_no,
                salary: roleValue === 'HR' ? 2500 : 0,
                designation: roleValue === 'HR' ? 'HR' : '',
                isVerified: false
            };

            await axiosPublic.post('/users', userData);

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                showConfirmButton: false,
                timer: 1500
            });

            navigate('/');
        }
        catch (error) {
            console.error("Registration Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message || 'Something went wrong!'
            });
        }
    };

    const generateInitialAvatar = (name) => {
        const initial = name.charAt(0).toUpperCase();
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#${getRandomColor()}"/>
                <text x="50" y="65" text-anchor="middle" fill="white" font-size="50">${initial}</text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    const getRandomColor = () => {
        return Math.floor(Math.random() * 16777215).toString(16);
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-dark-background flex items-center justify-center px-4 py-8">
            <Card
                className="w-full max-w-5xl bg-white dark:bg-dark-surface shadow-elevated rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
            >
                {/* Right Side - Registration Form */}
                <div className="p-8 space-y-6">
                    <div className="text-center">
                        <Typography variant="h4" color="blue-gray" className="dark:text-white">
                            Sign Up
                        </Typography>
                        <Typography color="gray" className="mt-2 dark:text-neutral-400">
                            Create your account to get started
                        </Typography>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                        {/* Name Input */}
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-100" />
                            <Input
                                size="lg"
                                name="name"
                                placeholder="Full Name"
                                className="pl-10 !border-neutral-300 focus:!border-primary-500  dark:bg-dark-neutral-200 dark:text-white dark:caret-white"
                                labelProps={{
                                    className: "hidden"
                                }}
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-300" />
                            <Input
                                size="lg"
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                className="pl-10 !border-neutral-300 focus:!border-primary-500 dark:bg-dark-neutral-200 dark:text-white dark:caret-white"
                                labelProps={{
                                    className: "hidden"
                                }}
                                required
                            />
                        </div>

                        {/* Bank Account Input */}
                        <div className="relative">
                            <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-300" />
                            <Input
                                size="lg"
                                name="bank_account_no"
                                placeholder="Bank Account Number"
                                className="pl-10 !border-neutral-300 focus:!border-primary-500 dark:bg-dark-neutral-200 dark:text-white dark:caret-white"
                                labelProps={{
                                    className: "hidden"
                                }}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-300" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className="pr-12 pl-10 !border-neutral-300 focus:!border-primary-500 dark:bg-dark-neutral-200 dark:text-white caret-black dark:caret-white"
                                labelProps={{
                                    className: "hidden"
                                }}
                                icon={
                                    showPassword ? (
                                        <EyeOffIcon
                                            onClick={() => setShowPassword(false)}
                                            className="cursor-pointer text-neutral-400 dark:text-neutral-300"
                                        />
                                    ) : (
                                        <EyeIcon
                                            onClick={() => setShowPassword(true)}
                                            className="cursor-pointer text-neutral-400 dark:text-neutral-300"
                                        />
                                    )
                                }
                                required
                                onChange={(e) => validatePassword(e.target.value)}
                            />
                        </div>

                        {/* Password Validation Errors */}
                        <div className="space-y-1 text-sm">
                            {passwordErrors.length && (
                                <Typography
                                    variant="small"
                                    color="red"
                                    className="flex items-center gap-1"
                                >
                                    • Password must be at least 6 characters long
                                </Typography>
                            )}
                            {passwordErrors.capital && (
                                <Typography
                                    variant="small"
                                    color="red"
                                    className="flex items-center gap-1"
                                >
                                    • Password must contain at least one capital letter
                                </Typography>
                            )}
                            {passwordErrors.specialChar && (
                                <Typography
                                    variant="small"
                                    color="red"
                                    className="flex items-center gap-1"
                                >
                                    • Password must contain at least one special character
                                </Typography>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="relative">
                            <Input
                                type="file"
                                name="image"
                                accept="image/*"
                                label="Upload Profile Picture"

                                className="!border-neutral-300 border-t-0 focus:!border-primary-500 dark:bg-dark-neutral-200 dark:text-white text-base"
                                labelProps={{
                                    className: "text-sm dark:text-white  !border-neutral-300"
                                }}
                            />
                        </div>

                        {/* Role Selection */}
                        <Select
                            label="Select Your Role"
                            value={selectedRole}
                            onChange={(selectedValue) => {
                                setSelectedRole(selectedValue);
                            }}
                            className="!border-neutral-300 border-t-0 focus:!border-primary-500 dark:bg-dark-neutral-200 dark:text-white"
                            labelProps={{
                                className: "text-sm dark:text-white" // Larger label text
                            }}
                        >
                            <Option value="Employee">Employee</Option>
                            <Option value="HR">HR</Option>
                        </Select>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="bg-primary-500 hover:bg-primary-600 dark:bg-dark-primary-500 dark:hover:bg-dark-primary-600"
                            fullWidth
                        >
                            Sign Up
                        </Button>

                        <Typography color="gray" className="mt-4 text-center dark:text-neutral-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary-500 hover:text-primary-600 dark:text-dark-primary-500 dark:hover:text-dark-primary-400"
                            >
                                Sign In
                            </Link>
                        </Typography>
                    </form>

                    {/* Divider */}
                    <div className="my-4 flex items-center justify-center">
                        <div className="border-t border-neutral-300 dark:border-dark-neutral-300 w-full"></div>
                        <span className="px-4 text-neutral-500 dark:text-neutral-400">or</span>
                        <div className="border-t border-neutral-300 dark:border-dark-neutral-300 w-full"></div>
                    </div>

                    {/* Google Sign In */}
                    <Button
                        variant="outlined"
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center gap-2 w-full border-primary-500 text-primary-500 hover:bg-primary-50 dark:border-dark-primary-500 dark:text-dark-primary-500 dark:hover:bg-dark-primary-900/10"
                    >
                        <FcGoogle size={24} />
                        Continue with Google
                    </Button>
                </div>

                {/* Left Side - Illustration */}
                <div className="hidden md:flex flex-col justify-center items-center bg-primary-500 dark:bg-dark-primary-500 p-8 text-white">
                    <Typography variant="h3" className="mb-4 text-center">
                        Join Our Team
                    </Typography>
                    <Typography className="text-center mb-6">
                        Create your account and start your journey with us
                    </Typography>
                    <Lottie
                        animationData={img}
                        loop={true}
                        className="max-w-full h-auto w-full"
                        style={{ maxWidth: '500px' }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default Register;