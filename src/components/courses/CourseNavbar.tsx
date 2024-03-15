import { Chapter, Course } from "@prisma/client";
import CourseMobileSidebar from "./CourseMobileSidebar";
import NavbarRoutes from "../shared/NavbarRoutes";

interface CourseNavbarProps {
    course: Course & {
        chapters: Chapter[];
    };
    isPurchased: boolean;
};

const CourseNavbar = ({ course, isPurchased }: CourseNavbarProps) => {

    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <CourseMobileSidebar
                course={course}
                isPurchased={isPurchased}
            />
            <NavbarRoutes />
        </div>
    );
};

export default CourseNavbar;