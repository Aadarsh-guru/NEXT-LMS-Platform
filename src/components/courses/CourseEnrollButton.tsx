"use client";
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { checkoutAction, verifyPaymentAction } from '@/actions/checkout';
import { toast } from '../ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
    children: React.ReactNode;
};

const CourseEnrollButton: React.FC<CourseEnrollButtonProps> = ({ price, courseId, children }) => {

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const session = useSession();
    const router = useRouter();
    const serachParams = useSearchParams();

    const [isVeryfying, setIsVeryfying] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const paymentHandlerFunction = async (response: any) => {
        setIsVeryfying(true);
        try {
            const { success, message } = await verifyPaymentAction({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                courseId,
            });
            if (success) {
                window.location.reload();
                router.push(`/courses/${courseId}`);
                return toast({
                    title: message,
                });
            }
            else {
                return toast({
                    title: message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            console.log(error);
            return toast({
                title: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
            setIsVeryfying(false);
        };
    };


    const handleCheckout = async () => {
        if (session.status !== 'authenticated') {
            setOpenDialog(true);
            return;
        }
        setLoading(true);
        try {
            const { success, order } = await checkoutAction(price);
            if (!success) {
                return toast({
                    title: "Something went wrong.",
                    variant: "destructive",
                });
            }
            if (typeof window !== 'undefined') {
                // @ts-expect-error
                const rzp = new window.Razorpay({
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: order.amount,
                    name: process.env.NEXT_PUBLIC_APP_NAME || 'Aadarsh Guru',
                    currency: order.currency,
                    order_id: order.id,
                    handler: paymentHandlerFunction,
                    prefill: {
                        name: session?.data?.user?.name,
                        email: session?.data?.user?.email,
                        contact: session?.data?.user?.email,
                    },
                });
                rzp.open();
                rzp.on('payment.failed', function () {
                    rzp.close();
                    return toast({
                        title: "Payment failed.",
                        variant: "destructive",
                    });
                });
            }
        } catch (error: any) {
            console.log(error);
            return toast({
                title: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const onSignIn = async (method: 'google') => {
        setIsLoading(true);
        try {
            await signIn(method, {
                redirect: false
            });
            setOpenDialog(false);
        } catch (error) {
            console.log(error);
            toast({
                title: serachParams.get('error') || 'somethiong went wrong.',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                onClick={handleCheckout}
                disabled={loading || isVeryfying}
            >
                {(loading || isVeryfying) ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {loading && 'Processing..'}
                        {isVeryfying && 'Verifying..'}
                    </>
                ) : (
                    <>
                        {children}
                    </>
                )}
            </Button>
            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)} >
                <DialogContent className="max-w-sm" >
                    <DialogHeader>
                        <DialogTitle className="text-center" >Sign in</DialogTitle>
                        <DialogDescription className="text-center" >
                            To continue to the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="py-4" >
                        <Button
                            onClick={() => onSignIn('google')}
                            className={cn(
                                "w-full flex items-center justify-center gap-x-2",
                                isLoading && "cursor-not-allowed"
                            )}
                            variant={'outline'}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Image
                                    src="/google.svg"
                                    alt="Google logo"
                                    width={20}
                                    height={20}
                                    className="mr-2 h-5 w-5"
                                />
                            )}
                            Continue with google
                        </Button>
                    </DialogFooter>
                    <div className="text-xs text-gray-700 text-center">
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CourseEnrollButton;