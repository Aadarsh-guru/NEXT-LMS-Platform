"use client"
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Chapter, Course } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import ChaptersList from "./ChaptersList";
import { createChapterAction, reorderChaptersAction } from "@/actions/chapters";


interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1)
});

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {

    const router = useRouter();
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { success, message } = await createChapterAction(courseId, values);
            if (success) {
                router.refresh();
                setIsCreating(false);
                toast({
                    title: message,
                });
                form.reset();
            }
        } catch (error: any) {
            console.log(error);
            return toast({
                title: error.message || "Something wemt wrong!",
                variant: "destructive"
            });
        }
    }

    const onReorder = async (updateData: { id: string, position: number }[]) => {
        setIsUpdating(true);
        try {
            const { success, message } = await reorderChaptersAction(courseId, updateData);
            if (success) {
                router.refresh();
                setIsCreating(false);
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
            setIsUpdating(false);
        }
    }

    const onEdit = async (id: string) => {
        router.push(`/dashboard/courses/${courseId}/chapters/${id}`);
    };

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-stone-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                    <Loader2 className="animate-spin h6 w-6 text-sky-700" />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={() => setIsCreating(!isCreating)} variant={'outline'} >
                    {isCreating ?
                        (
                            <>Cancel</>
                        )
                        :
                        (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add a chapter
                            </>
                        )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4" >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={!isValid || isSubmitting} >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData?.chapters.length && "text-slate-500 italic"
                )}>
                    {!initialData.chapters.length && " No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={initialData.chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4" >
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    );
};

export default ChaptersForm;