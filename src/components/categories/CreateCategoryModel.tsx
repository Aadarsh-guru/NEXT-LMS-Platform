import * as z from "zod"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { createCategoryAction } from "@/actions/categories";


const formSchema = z.object({
    name: z.string().min(1, { message: "Category name is required" })
});

function CreateCategoryModel() {

    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async ({ name }: z.infer<typeof formSchema>) => {
        try {
            const { success, message } = await createCategoryAction(name);
            if (success) {
                router.refresh();
                setOpen(false);
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
        };
    };

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <Button onClick={() => setOpen(true)} className="ml-auto" >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Category
            </Button>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new category</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Form {...form} >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            required
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Engineering'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </Form>
                </div>
                <DialogFooter>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || !isValid} >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryModel;