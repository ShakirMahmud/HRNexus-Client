import { useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
    Button,
    Typography,
} from "@material-tailwind/react";

const RoleSelectionModal = ({ isOpen, onClose, onConfirm, role, setRole }) => {
    const [bankAccountNo, setBankAccountNo] = useState("");

    const handleConfirm = () => {
        if (!role || !bankAccountNo) {
            alert("Please fill in all fields.");
            return;
        }
        onConfirm({ role, bankAccountNo });
    };

    return (
        <Dialog
            open={isOpen}
            handler={() => {}}
            dismissible={false}
            className="bg-transparent shadow-none"
        >
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                <DialogHeader>Select Your Role</DialogHeader>
                <DialogBody>
                    <Typography variant="h6" color="blue-gray" className="mb-1">
                        Your Bank Account Number
                    </Typography>
                    <Input
                        size="lg"
                        value={bankAccountNo}
                        onChange={(e) => setBankAccountNo(e.target.value)}
                        placeholder="123456789"
                        className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    />
                </DialogBody>
                <DialogBody>
                    <Select
                        label="Choose Your Role"
                        value={role}
                        onChange={(value) => setRole(value)}
                    >
                        <Option value="Employee">Employee</Option>
                        <Option value="HR">HR</Option>
                    </Select>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleConfirm}
                        disabled={!role || !bankAccountNo}
                    >
                        Confirm Role
                    </Button>
                    <Button variant="text" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogFooter>
            </div>
        </Dialog>
    );
};

export default RoleSelectionModal;
