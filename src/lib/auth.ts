import { AuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';

const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                if (user?.email) {
                    const exist = await prisma.user.findUnique({
                        where: {
                            email: user?.email
                        }
                    })
                    if (!exist) {
                        await prisma.user.create({
                            data: {
                                name: user?.name!,
                                email: user?.email,
                                image: user?.image!,
                                role: 'USER'
                            }
                        });
                    }
                    return true;
                } else {
                    return false
                }
            } catch (error: any) {
                return false;
            }
        },
        async session({ session, }) {
            try {
                const exist = await prisma.user.findUnique({
                    where: {
                        email: session.user?.email!
                    }
                });
                if (exist) {
                    // @ts-ignore
                    session.user.id = exist.id;
                    // @ts-expect-error
                    session.user.role = (exist?.email === String(process.env.GMAIL_MAIL_USER_ID) ? "ADMIN" : exist?.role);
                }
                return session;
            } catch (error: any) {
                throw new Error(error.message);
            }
        },
    },
    pages: {
        error: '/',
        signIn: '/',
        signOut: '/',
    }
};

export default authOptions;