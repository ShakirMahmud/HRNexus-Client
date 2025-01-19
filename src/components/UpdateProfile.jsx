import React from 'react';
import { motion } from 'framer-motion';
import {
    Typography,
    Avatar,
    Chip
} from "@material-tailwind/react";
import {
    BadgeCheckIcon,
    ClockIcon,
    UserIcon,
    BriefcaseIcon,
    MailIcon,
    WalletIcon,
    DollarSignIcon
} from 'lucide-react';
import useAuth from "../hooks/useAuth";
import useUsers from "../hooks/useUsers";

const UpdateProfile = () => {
    const { user } = useAuth();
    const { userByEmail } = useUsers(user?.email);

    if (!userByEmail) return null;

    // Role Color Mapping
    const getRoleColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin': return 'bg-danger-500';
            case 'hr': return 'bg-primary-500';
            case 'employee': return 'bg-success-500';
            default: return 'bg-neutral-500';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-neutral-200 rounded-2xl shadow-lg p-6 space-y-6"
        >
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <Avatar
                        src={userByEmail?.image || user?.photoURL}
                        alt="Profile Picture"
                        className="h-32 w-32 border-4 border-primary-500 shadow-lg"
                    />
                </div>

                <div className="text-center">
                    <Typography
                        variant="h4"
                        className="text-neutral-800 dark:text-dark-text-primary "
                    >
                        {userByEmail?.name}
                    </Typography>

                    {/* Role Chip */}
                    <Chip
                        value={userByEmail?.roleValue}
                        icon={<UserIcon className="h-4 w-4" />}
                        className={`mt-2 ${getRoleColor(userByEmail?.roleValue)} text-white`}
                    />
                </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex items-center space-x-3 bg-neutral-100 dark:bg-dark-neutral-300 p-4 rounded-xl">
                    <MailIcon className="h-6 w-6 text-primary-500" />
                    <div>
                        <Typography
                            variant="small"
                            className="text-neutral-600 dark:text-dark-text-secondary "
                        >
                            Email
                        </Typography>
                        <Typography
                            variant="h4"
                            className="text-neutral-800 dark:text-dark-text-primary break-words w-full max-w-[150px] whitespace-normal overflow-hidden  text-overflow-ellipsis line-clamp-2 font-normal text-sm"
                        >
                            {userByEmail?.email}
                        </Typography>
                    </div>
                </div>

                {/* Designation */}
                <div className="flex items-center space-x-3 bg-neutral-100 dark:bg-dark-neutral-300 p-4 rounded-xl">
                    <BriefcaseIcon className="h-6 w-6 text-success-500" />
                    <div>
                        <Typography
                            variant="small"
                            className="text-neutral-600 dark:text-dark-text-secondary"
                        >
                            Designation
                        </Typography>
                        <Typography
                            variant="paragraph"
                            className="text-neutral-800 dark:text-dark-text-primary font-semibold"
                        >
                            {userByEmail?.designation || 'Not Specified'}
                        </Typography>
                    </div>
                </div>

                {/* Bank Account */}
                <div className="flex items-center space-x-3 bg-neutral-100 dark:bg-dark-neutral-300 p-4 rounded-xl">
                    <WalletIcon className="h-6 w-6 text-primary-500" />
                    <div>
                        <Typography
                            variant="small"
                            className="text-neutral-600 dark:text-dark-text-secondary"
                        >
                            Bank Account
                        </Typography>
                        <Typography
                            variant="paragraph"
                            className="text-neutral-800 dark:text-dark-text-primary font-semibold"
                        >
                            {userByEmail?.bank_account_no || 'Not Added'}
                        </Typography>
                    </div>
                </div>

                {/* Salary */}
                <div className="flex items-center space-x-3 bg-neutral-100 dark:bg-dark-neutral-300 p-4 rounded-xl">
                    <DollarSignIcon className="h-6 w-6 text-success-500" />
                    <div>
                        <Typography
                            variant="small"
                            className="text-neutral-600 dark:text-dark-text-secondary"
                        >
                            Current Salary
                        </Typography>
                        <Typography
                            variant="paragraph"
                            className="text-neutral-800 dark:text-dark-text-primary font-semibold"
                        >
                            {userByEmail?.salary ? `$${userByEmail.salary}` : 'Not Disclosed'}
                        </Typography>
                    </div>
                </div>

                {/* Verification Status (exclude for admin) */}
                {userByEmail?.roleValue !== 'admin' && (
                    <div className="flex items-center space-x-3 bg-neutral-100 dark:bg-dark-neutral-300 p-4 rounded-xl">
                        {userByEmail?.isVerified ? (
                            <div className="flex items-center text-success-500">
                                <BadgeCheckIcon className="h-6 w-6 mr-3" />
                                <div>
                                    <Typography
                                        variant="small"
                                        className="text-neutral-600 dark:text-dark-text-secondary"
                                    >
                                        Verification Status
                                    </Typography>
                                    <Typography
                                        variant="paragraph"
                                        className="text-success-500 font-semibold"
                                    >
                                        Verified
                                    </Typography>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center text-warning-500">
                                <ClockIcon className="h-6 w-6 mr-3" />
                                <div>
                                    <Typography
                                        variant="small"
                                        className="text-neutral-600 dark:text-dark-text-secondary"
                                    >
                                        Verification Status
                                    </Typography>
                                    <Typography
                                        variant="paragraph"
                                        className="text-warning-500 font-semibold"
                                    >
                                        Pending
                                    </Typography>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default UpdateProfile;