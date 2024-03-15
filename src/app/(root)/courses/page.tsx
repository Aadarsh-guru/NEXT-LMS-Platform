import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import authOptions from "@/lib/auth";
import CoursesList from "@/components/courses/CoursesList";
import Banner from "@/components/shared/Banner";

export const metadata: Metadata = {
    title: `Courses - ${process.env.NEXT_PUBLIC_APP_NAME || 'Aadarsh Guru'}`,
};

const CoursesPage = async () => {

    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/");
    }

    const userPurchases = await prisma.purchase.findMany({
        where: {
            // @ts-expect-error
            userId: session.user?.id,
        },
        select: {
            courseId: true,
        },
    });

    // Extract course IDs from user's purchases
    const courseIds = userPurchases.map(purchase => purchase.courseId);

    // Fetch courses based on the extracted course IDs
    const courses = await prisma.course.findMany({
        where: {
            id: {
                in: courseIds,
            },
        },
        include: {
            category: true,
            chapters: {
                where: {
                    isPublished: true,
                },
                select: {
                    id: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <>
            {courses.length === 0 && (
                <Banner
                    label="You have't purchased any course yet, purchase courses to see here."
                />
            )}
            <div className="px-6 pb-6 pt-2">
                <CoursesList
                    items={courses}
                    isCoursesPage={true}
                />
            </div>
        </>
    )
};

export default CoursesPage;