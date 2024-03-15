import { Menu } from "lucide-react";
import { Chapter, Course } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseSidebar from "./CourseSidebar";

interface CourseMobileSidebarProps {
    course: Course & {
        chapters: Chapter[];
    };
    isPurchased: boolean;
};

const CourseMobileSidebar = ({ course, isPurchased }: CourseMobileSidebarProps) => {

    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition" >
                <Menu />
            </SheetTrigger>
            <SheetContent side={'left'} className="p-0 bg-white" >
                <CourseSidebar
                    course={course}
                    isPurchased={isPurchased}
                />
            </SheetContent>
        </Sheet>
    );
};

export default CourseMobileSidebar;