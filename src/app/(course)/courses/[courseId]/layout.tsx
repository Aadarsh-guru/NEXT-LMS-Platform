import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CourseSidebar from "@/components/courses/CourseSidebar";
import CourseNavbar from "@/components/courses/CourseNavbar";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import Footer from "@/components/shared/Footer";

export default async function CourseLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: { courseId: string },
}) {

    const course = await prisma.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc",
                }
            }
        },
    });

    if (!course) {
        return redirect("/");
    }

    const session = await getServerSession(authOptions);

    const isPurchased = await prisma.purchase.findFirst({
        where: {
            courseId: params.courseId,
            // @ts-expect-error
            userId: session?.user?.id
        },
        select: {
            id: true,
        }
    });

    return (
        <div className="h-full">
            <div className="h-20 md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course}
                    isPurchased={(session && isPurchased) ? true : false}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    isPurchased={(session && isPurchased) ? true : false}
                />
            </div>
            <main className="md:pl-80 pt-20 min-h-full" >
                {children}
            </main>
            <footer className="w-full md:pl-80 relative bottom-0 border-t" >
                <Footer />
            </footer>
        </div>
    );
};
