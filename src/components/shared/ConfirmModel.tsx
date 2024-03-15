"use client"
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../ui/alert-dialog";

interface ConfirmModelProps {
    children: React.ReactNode;
    onConfirm: () => void;
};

const ConfirmModel = ({ children, onConfirm }: ConfirmModelProps) => {

    const router = useRouter();

    const handleClick = () => {
        onConfirm();
        router.refresh();
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild >
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClick}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmModel;