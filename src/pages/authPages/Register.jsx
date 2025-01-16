import {
    Card,
    Input,
    Button,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import RoleSelectionModal from "./RoleSelectionModal";
import useGoogleSignIn from "../../hooks/useGoogleSignIn";

const Register = () => {
    const { createUser, setUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const [selectedRole, setSelectedRole] = useState('Employee');

    const IMAGE_HOSTING_KEY = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const IMAGE_HOSTING_API = `https://api.imgbb.com/1/upload?key=${IMAGE_HOSTING_KEY}`;

    const handleSignUp = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const bank_account_no = form.bank_account_no.value;
        const password = form.password.value;
        const imageFile = form.image.files[0];
        const roleValue = selectedRole;

        try {
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
                salaryPerHour: roleValue === 'HR' ? 2500 : 0,
                designation: '',
                isVerified: false
            };
            const response = await axiosPublic.post('/users', userData);
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
    }

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

    const {
        isRoleModalOpen,
        setIsRoleModalOpen,
        handleGoogleSignIn,
        handleRoleConfirm,
        role,
        setRole,
    } = useGoogleSignIn();

    return (
        <Card color="transparent" shadow={false} className="w-full min-h-screen flex justify-center items-center">
            <Typography variant="h4" color="blue-gray">
                Sign Up
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter your details to register.
            </Typography>
            <form onSubmit={handleSignUp} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Your Name
                    </Typography>
                    <Input
                        size="lg"
                        name="name"
                        placeholder="name"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Your Email
                    </Typography>
                    <Input
                        size="lg"
                        name="email"
                        placeholder="name@mail.com"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Your Bank Account Number
                    </Typography>
                    <Input
                        size="lg"
                        name="bank_account_no"
                        placeholder="123456789"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Password
                    </Typography>
                    <Input
                        type="password"
                        size="lg"
                        name="password"
                        placeholder="********"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    {/* image upload  */}
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Upload Your Image
                    </Typography>
                    <Input
                        type="file"
                        accept="image/*"
                        size="lg"
                        name="image"
                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                            className: "before:content-none after:content-none"
                        }}
                    />
                    <div className="w-72">
                        <Select
                            label="Select Your Role"
                            value={selectedRole}
                            onChange={(selectedValue) => {
                                setSelectedRole(selectedValue);
                            }}
                        >
                            <Option value="Employee">Employee</Option>
                            <Option value="HR">HR</Option>
                        </Select>
                    </div>
                </div>

                <Button type="submit" className="mt-6" fullWidth>
                    sign up
                </Button>
                <Typography color="gray" className="mt-4 text-center font-normal">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-gray-900">
                        Sign In
                    </Link>
                </Typography>
            </form>
            <div className="w-full flex justify-center py-6">
                <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 rounded-lg shadow hover:shadow-md transition-all duration-300 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <FcGoogle size={24} />
                    <span className="text-lg font-medium">Log In with Google</span>
                </button>
            </div>
            <RoleSelectionModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                onConfirm={handleRoleConfirm}
                role={role}
                setRole={setRole}
            />
        </Card>
    );
};

export default Register;