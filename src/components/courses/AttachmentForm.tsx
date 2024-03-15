"use client"
import * as z from "zod";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { createAttachmentAction, deleteAttachmentAction } from "@/actions/attachments";
import uploadMedia from "@/lib/upload";
import { Input } from "../ui/input";


interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
}

const formSchema = z.object({
    url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { success, message } = await createAttachmentAction(courseId, values);
            if (success) {
                router.refresh();
                setIsEditing(false);
                toast({
                    title: message,
                });
            }
        } catch (error: any) {
            console.log(error);
            return toast({
                title: error.message || "Something wemt wrong!",
                variant: "destructive"
            });
        }
    }

    const hanldeUpload = async () => {
        setIsUploading(true);
        try {
            if (file) {
                const mediaUrl = await uploadMedia(file, 'courses/attachments');
                if (mediaUrl) {
                    onSubmit({ url: mediaUrl });
                };
            };
        } catch (error: any) {
            console.log(error);
            return toast({
                title: error.message || "Something wemt wrong!",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            const { success, message } = await deleteAttachmentAction(courseId, id);
            if (success) {
                router.refresh();
                setIsEditing(false);
                toast({
                    title: message,
                });
            }
        } catch (error: any) {
            console.log(error);
            return toast({
                title: error.message || "Something wemt wrong!",
                variant: "destructive"
            });
        } finally {
            setDeletingId('');
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between mb-2">
                Course attachments
                <Button onClick={() => setIsEditing(!isEditing)} variant={'outline'} >
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic" >
                            No attachments yet.
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attachment, index) => (
                                <div
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                    key={index}
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1" >
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div className="ml-auto" >
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            onClick={() => onDelete(attachment.id)}
                                            className="ml-auto hover:opacity-75 transition"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <div className="w-full flex items-center gap-4 py-4">
                        <Input
                            type="file"
                            disabled={isUploading}
                            onChange={(e) => setFile(e.target.files![0])}
                        />
                        <Button
                            type="button"
                            disabled={!file || isUploading}
                            onClick={hanldeUpload}
                        >
                            {isUploading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            )
                                :
                                "Upload"}
                        </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete this course.
                    </div>
                </div>
            )}
        </div>
    )
}

export default AttachmentForm