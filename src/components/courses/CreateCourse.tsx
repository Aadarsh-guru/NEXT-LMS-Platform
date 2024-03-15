"use client";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createCourseAction } from "@/actions/courses";


const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
});

const CreateCourse = () => {

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { success, course, message } = await createCourseAction(values);
            if (success) {
                toast({ title: message });
                router.push(`/dashboard/courses/${course.id}`);
                form.reset();
            }
        } catch (error: any) {
            console.log(error);
            toast({
                title: error.message || "something went wrong.",
                variant: 'destructive'
            });
        }
    };

    return (
        <div>
            <h1 className="text-2xl" >
                Name your course
            </h1>
            <p className="text-sm text-slate-500" >
                What would you like to call your course? Don not worry you can change this later.
            </p>
            <Form {...form} >
                <form
                    className="space-y-8 mt-8"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Course title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isSubmitting}
                                        placeholder="e.g. 'Advanced web development'"
                                    />
                                </FormControl>
                                <FormDescription>
                                    What will you teach in this course?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Link href={'/dashboard/courses'} >
                            <Button variant={'outline'} type="button" >
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={!isValid || isSubmitting} >
                            Continue
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateCourse;