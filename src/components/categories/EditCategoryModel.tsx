import * as z from "zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { updateCategoryAction } from "@/actions/categories";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(1, { message: "Category name is required" })
});

function EditCategoryModel({ id, name }: { id: string, name: string }) {

    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async ({ name }: z.infer<typeof formSchema>) => {
        try {
            const { success, message } = await updateCategoryAction(id, name);
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
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)} >
            <Button onClick={() => setOpen(true)} variant={'ghost'} size={'icon'} className="cursor-pointer" >
                <Pencil className="h-4 w-4" />
            </Button>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit category</DialogTitle>
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
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={!isValid || isSubmitting}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditCategoryModel;