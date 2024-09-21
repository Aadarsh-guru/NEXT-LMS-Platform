"use server";
import crypto from 'crypto';
import Razorpay from "razorpay";
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import prisma from "@/lib/prisma";
import sendMail from '@/lib/mail';
import { coursePurchaseConfirmationMailTemplate, coursePurchasedMailTemplate } from '@/lib/templates';


const instence = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string
});


const checkoutAction = async (amount: number) => {
    try {
        const order = await instence.orders.create({
            amount: amount * 100,
            currency: 'INR'
        });
        return {
            message: 'Order created successfully',
            success: true,
            order
        };
    } catch (error) {
        throw error;
    }
};


interface VerifyPaymentAction {
    paymentId: string;
    orderId: string;
    signature: string;
    courseId: string;
};


const verifyPaymentAction = async ({ paymentId, orderId, signature, courseId }: VerifyPaymentAction) => {
    try {
        const session = await getServerSession(authOptions);
        if (!verifyCustomSignature(orderId, paymentId, signature, process.env.RAZORPAY_KEY_SECRET as string)) {
            return {
                message: 'Payment verification failed.',
                success: false
            };
        };
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            }
        });
        const purchase = await prisma.purchase.create({
            data: {
                // @ts-expect-error
                userId: session?.user?.id,
                courseId: courseId,
                price: course?.price!
            }
        });
        await sendMail({
            to: session?.user?.email!,
            subject: 'Course purchased!',
            html: coursePurchaseConfirmationMailTemplate({
                paymentId,
                orderId,
                course,
                username: session?.user?.name!
            })
        });
        await sendMail({
            to: process.env.GMAIL_MAIL_USER_ID as string,
            subject: 'New purchase!',
            html: coursePurchasedMailTemplate({
                paymentId,
                orderId,
                course,
                username: session?.user?.name!,
                useremail: session?.user?.email!
            })
        });
        return {
            message: 'Course purchased successfully.',
            success: true,
            purchase,
        };
    } catch (error) {
        throw error;
    }
};


function hmac_sha256(data: any, key: string) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data);
    return hmac.digest('hex');
};


function verifyCustomSignature(orderId: string, razorpayPaymentId: string, signature: string, secret: string) {
    const generatedSignature = hmac_sha256(orderId + "|" + razorpayPaymentId, secret);
    return generatedSignature === signature;
};


export {
    checkoutAction,
    verifyPaymentAction,
};