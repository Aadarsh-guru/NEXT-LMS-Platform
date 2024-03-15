import { Metadata } from "next";
import prisma from "@/lib/prisma";
import DataTable, { columns } from "@/components/courses/DataTable";

export const metadata: Metadata = {
    title: `Dashboard - Courses`,
};

const CoursesPage = async () => {

    const courses = await prisma.course.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="p-6">
            <DataTable
                columns={columns}
                data={courses}
            />
        </div>
    );
};

export default CoursesPage;