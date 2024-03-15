"use client"
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Chapter } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { updateChapterAction } from "@/actions/chapters";


interface ChapterAccessFormProps {
    initialData: Chapter;
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    isFree: z.boolean().default(false)
});

const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { success, message } = await updateChapterAction(chapterId, courseId, values);
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

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter access
                <Button onClick={() => setIsEditing(!isEditing)} variant={'outline'} >
                    {isEditing ?
                        (
                            <>Cancel</>
                        )
                        :
                        (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit access
                            </>
                        )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.isFree && "text-slate-500 italic"
                )}
                >
                    {initialData.isFree ? (
                        <>
                            This chapter is free for preview.
                        </>
                    ) : (
                        <>
                            This chapter is not free.
                        </>
                    )}
                </p>
            )}
            {isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4" >
                        <FormField
                            control={form.control}
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4" >
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormDescription>
                                            Check this box if you want to make this chaper free for preview.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="submit" disabled={!isValid || isSubmitting} >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default ChapterAccessForm;