import { Category, Course } from "@prisma/client";
import CourseCard from "./CourseCard";

type CoursesWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {
        id: string;
    }[];
    isCoursesPage?: boolean;
};

interface CoursesListProps {
    items: CoursesWithProgressWithCategory[];
    isCoursesPage?: boolean;
};

const CoursesList = ({ items, isCoursesPage }: CoursesListProps) => {

    return (
        <div className="mt-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4" >
                {items.map((item, index) => (
                    <CourseCard
                        key={index}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chaptersLength={item.chapters.length}
                        price={item.price!}
                        category={item?.category?.name!}
                        isCoursesPage={isCoursesPage}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10" >
                    No courses found
                </div>
            )}
        </div>
    );
};

export default CoursesList;