import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth";

export const metadata: Metadata = {
    title: `Dashboard - ${process.env.NEXT_PUBLIC_APP_NAME || 'Aadarsh Guru'}`,
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/");
    }

    // @ts-expect-error
    if (session?.user?.role !== 'ADMIN') {
        return redirect("/");
    }

    return (
        <>
            {children}
        </>
    );
};
