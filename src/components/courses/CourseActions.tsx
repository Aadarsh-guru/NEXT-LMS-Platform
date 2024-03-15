"use client"
import { useState } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ConfirmModel from "../shared/ConfirmModel";
import { deleteCourseAction, publishCourseAction, unpublishCourseAction } from "@/actions/courses";

interface CourseActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
};

const CourseActions = ({ disabled, courseId, isPublished }: CourseActionsProps) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        setIsLoading(true);
        try {
            const { success, message } = await deleteCourseAction(courseId);
            if (success) {
                toast({
                    title: message,
                });
                router.refresh();
                router.push(`/dashboard/courses`);
            }
        } catch (error: any) {
            console.log(error);
            toast({
                title: error.message || "Something went wrong!",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onPublish = async () => {
        setIsLoading(true)
        try {
            if (isPublished) {
                const { success, message } = await unpublishCourseAction(courseId);
                if (success) {
                    toast({
                        title: message,
                    });
                }
            } else {
                const { success, message } = await publishCourseAction(courseId);
                if (success) {
                    toast({
                        title: message,
                    });
                }
            }
            router.refresh();
            return router.push(`/dashboard/courses`);
        } catch (error: any) {
            console.log(error);
            toast({
                title: error.message || "Something went wrong!",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onPublish}
                variant={'outline'}
                disabled={disabled || isLoading}
                size={'sm'}
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModel onConfirm={onDelete} >
                <Button disabled={isLoading} size={'sm'} >
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModel>
        </div>
    );
};

export default CourseActions;