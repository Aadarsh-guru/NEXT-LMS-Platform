import { Chapter, Course } from "@prisma/client";
import CourseSidebarItem from "./CourseSidebarItem";

interface CourseSidebarProps {
    course: Course & {
        chapters: Chapter[];
    };
    isPurchased: boolean;
};

const CourseSidebar = async ({ course, isPurchased }: CourseSidebarProps) => {

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            <div className="min-h-[80px] w-full flex items-center px-6 border-b">
                <h1 className="font-semibold">{course.title}</h1>
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter, index) => (
                    <CourseSidebarItem
                        key={index}
                        id={chapter.id}
                        label={chapter.title}
                        courseId={course.id}
                        isLocked={(chapter.isFree || isPurchased) ? false : true}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseSidebar;