"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Compass, Layout, LayoutList, List, BarChart } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";


const guestsRoutes = [
    {
        icon: Compass,
        label: "Browse",
        href: "/"
    },
];

const userRoutes = [
    {
        icon: Compass,
        label: "Browse",
        href: "/"
    },
    {
        icon: List,
        label: "Courses",
        href: "/courses"
    },
];

const adminRoutes = [
    {
        icon: BarChart,
        label: "Analytics",
        href: "/dashboard"
    },
    {
        icon: LayoutList,
        label: "Categories",
        href: "/dashboard/categories"
    },
    {
        icon: List,
        label: "Courses",
        href: "/dashboard/courses"
    },
];

const SidebarRoutes = () => {

    const router = useRouter();
    const session = useSession();
    const pathname = usePathname();

    const isAuthenticated = session.status === "authenticated";
    // @ts-expect-error
    const isAdmin = session.data?.user?.role === "ADMIN";
    const isDashboard = pathname.startsWith("/dashboard");

    const routes = isAuthenticated ?
        ((isAdmin && isDashboard) ? adminRoutes : userRoutes)
        :
        guestsRoutes;

    const onClick = () => {
        if (isDashboard) {
            router.push("/");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex flex-col w-full">
            {isAdmin && (
                <Button
                    type="button"
                    className={cn(
                        "m-2 flex justify-start transition-all duration-300",
                        !isDashboard && " border-sky-700 text-sky-700 hover:text-sky-500"
                    )}
                    variant={'outline'}
                    onClick={onClick}
                >
                    {isDashboard ? (
                        <>
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Back
                        </>
                    ) : (
                        <>
                            <Layout className="mr-2 h-5 w-5" />
                            Dashboard
                        </>
                    )}
                </Button>
            )}
            {routes.map((route, index) => (
                <SidebarItem
                    key={index}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};

export default SidebarRoutes;