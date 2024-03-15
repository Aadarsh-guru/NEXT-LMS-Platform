"use client";
import { useEffect, useState } from "react";
import { BarChartIcon, Loader } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { toast } from "../ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getPurchasesAndRevenueAction } from "@/actions/courses";

type DataType = {
    daily: {
        total_purchases: number;
        total_revenue: number;
    };
    weekly: {
        total_purchases: number;
        total_revenue: number;
    };
    monthly: {
        total_purchases: number;
        total_revenue: number;
    };
    allTime: {
        total_purchases: number;
        total_revenue: number;
    };
};

function CourseAnalyticsModel({ courseId, title }: { courseId: string, title: string }) {

    const [open, setOpen] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const [data, setData] = useState<DataType>();

    const chartData = [
        { name: 'Day', ...data?.daily },
        { name: 'Week', ...data?.weekly },
        { name: 'Month', ...data?.monthly },
        { name: 'All', ...data?.allTime },
    ];

    useEffect(() => {
        ; (async () => {
            setFetching(true);
            try {
                const { success, data } = await getPurchasesAndRevenueAction(courseId);
                if (success) {
                    setData(data);
                } else {
                    return toast({
                        title: "Something went wrong",
                        variant: "destructive",
                    });
                };
            } catch (error: any) {
                console.log(error);
                return toast({
                    title: error.message,
                    variant: "destructive"
                });
            } finally {
                setFetching(false);
            };
        })();
    }, [courseId, title]);

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <Button onClick={() => setOpen(true)} variant={'ghost'} size={'icon'} className="cursor-pointer" >
                <BarChartIcon className="h-4 w-4" />
            </Button>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {fetching ? (
                        <div className="w-full h-[300px] flex justify-center items-center">
                            <Loader className="animate-spin duration-1000 h-10 w-10 text-gray-500" />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} >
                                <XAxis dataKey={'name'} />
                                <Tooltip />
                                <Bar dataKey="total_purchases" stackId="a" fill="#6b7280 " name="Purchases" />
                                <Bar dataKey="total_revenue" stackId="a" fill="#60a5fa" activeBar name="Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CourseAnalyticsModel;