"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { checkoutAction, verifyPaymentAction } from '@/actions/checkout';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
    children: React.ReactNode;
};

const CourseEnrollButton: React.FC<CourseEnrollButtonProps> = ({ price, courseId, children }) => {

    const session = useSession();
    const router = useRouter();
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
            return toast({
                title: "Please login to continue.",
            });
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


    return (
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
    );
};

export default CourseEnrollButton;