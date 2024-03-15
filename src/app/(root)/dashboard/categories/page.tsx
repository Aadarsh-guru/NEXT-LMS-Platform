import { Metadata } from "next";
import prisma from "@/lib/prisma";
import CategoriesTable, { columns } from "@/components/categories/CategoriesTable";

export const metadata: Metadata = {
    title: `Dashboard - Categories`,
};

const CategoriesPage = async () => {

    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            courses: {
                where: {
                    isPublished: true
                },
                select: {
                    id: true
                }
            }
        }
    });

    const categoriesWithCoursesCountFormatted = categories.map(category => ({
        ...category,
        courses: category.courses.length
    }));

    return (
        <div className="p-6">
            <CategoriesTable
                columns={columns}
                data={categoriesWithCoursesCountFormatted}
            />
        </div>
    );
};

export default CategoriesPage;