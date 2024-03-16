"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ConfirmModel from "../shared/ConfirmModel";
import { deleteChapterAction, publishChapterAction, unpublishChapterAction } from "@/actions/chapters";

interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
};

const ChapterActions = ({ disabled, chapterId, courseId, isPublished }: ChapterActionsProps) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        setIsLoading(true);
        try {
            const { success, message } = await deleteChapterAction(chapterId, courseId);
            if (success) {
                toast({
                    title: message,
                });
                router.refresh();
                return router.push(`/dashboard/courses/${courseId}`);
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
                const { success, message } = await unpublishChapterAction(chapterId, courseId);
                if (success) {
                    toast({
                        title: message,
                    });
                }
            } else {
                const { success, message } = await publishChapterAction(chapterId, courseId);
                if (success) {
                    toast({
                        title: message,
                    });
                }
            }
            router.refresh();
            return router.push(`/dashboard/courses/${courseId}`);
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

export default ChapterActions;