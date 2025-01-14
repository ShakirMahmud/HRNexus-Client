import {
    Card,
    Input,
    Button,
    Typography,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useCallback, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Register = () => {
    const { createUser, setUser, updateUserProfile, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Employee');
    const [pendingUser, setPendingUser] = useState(null);

    const IMAGE_HOSTING_KEY = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const IMAGE_HOSTING_API = `https://api.imgbb.com/1/upload?key=${IMAGE_HOSTING_KEY}`;

    const handleSignUp = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const imageFile = form.image.files[0];
        const roleValue = selectedRole;

        try {
            let imageUrl = generateInitialAvatar(name);

            // If image is uploaded, host it
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

            // Create user in Firebase
            const userCredential = await createUser(email, password);
            const user = userCredential.user;

            // Update user profile
            await updateUserProfile({
                displayName: name,
                photoURL: imageUrl
            });

            // Prepare user data for backend
            const userData = {
                name,
                email,
                roleValue,
                image: imageUrl
            };

            // Send user data to backend
            const response = await axiosPublic.post('/users', userData);

            // Show success message and navigate
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

    const handleSignInWithGoogle = async () => {
        try {
            const result = await signInWithGoogle();
            const user = result.user;

            // Check if user exists in database
            const response = await axiosPublic.get(`/users/check?email=${user.email}`);

            // If user exists and has a role, navigate directly
            if (response.data.exists && response.data.roleValue) {
                setUser(user);
                navigate('/');
                return;
            }

            // If no role, always open modal
            setPendingUser(user);
            setIsRoleModalOpen(true);
            setSelectedRole(''); // Reset selected role
        }
        catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Google Sign In Failed',
                text: err.message
            });
        }
    }

    // Prevent unnecessary re-renders
    const handleRoleSelection = useCallback(async () => {
        if (!pendingUser || !selectedRole) {
            Swal.fire({
                icon: 'error',
                title: 'Role Selection Required',
                text: 'Please select a role to continue'
            });
            return;
        }

        try {
            const userData = {
                name: pendingUser.displayName,
                email: pendingUser.email,
                roleValue: selectedRole,
                image: pendingUser.photoURL || generateInitialAvatar(pendingUser.displayName)
            };

            await axiosPublic.post('/users', userData);

            setUser(pendingUser);
            setIsRoleModalOpen(false);
            navigate('/');
        } catch (error) {
            console.error('Error adding user:', error);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: 'Unable to complete registration'
            });
        }
    }, [pendingUser, selectedRole, axiosPublic, navigate, setUser]);

    // Role Selection Modal
    const RoleSelectionModal = () => (
        <Dialog
            open={isRoleModalOpen}
            handler={() => { }}
            dismissible={false}
            animate={{
                mount: { scale: 1, opacity: 1 },
                unmount: { scale: 0.9, opacity: 0 },
            }}
            className="bg-transparent shadow-none"
        >
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <DialogHeader>Select Your Role</DialogHeader>
                <DialogBody>
                    <Select
                        label="Choose Your Role"
                        value={selectedRole}
                        onChange={(value) => setSelectedRole(value)}
                    >
                        <Option value="Employee">Employee</Option>
                        <Option value="HR">HR</Option>
                    </Select>
                </DialogBody>
                <DialogFooter>
                    {/* Remove cancel button */}
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleRoleSelection}
                        disabled={!selectedRole} // Disable until role is selected
                    >
                        Confirm Role
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
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
                        placeholder="name@mail.com"
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
                                // Ensure the value is set correctly
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
                    onClick={handleSignInWithGoogle}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-600 rounded-lg shadow hover:shadow-md transition-all duration-300 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <FcGoogle size={24} />
                    <span className="text-lg font-medium">Log In with Google</span>
                </button>
            </div>
            <RoleSelectionModal />
        </Card>
    );
};

export default Register;