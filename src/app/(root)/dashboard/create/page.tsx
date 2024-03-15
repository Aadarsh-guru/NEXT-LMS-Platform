import { Metadata } from "next";
import CreateCourse from "@/components/courses/CreateCourse";

export const metadata: Metadata = {
    title: `Dashboard - Create course`,
};

const CreateCoursePage = () => {

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <CreateCourse />
        </div>
    );
};

export default CreateCoursePage;