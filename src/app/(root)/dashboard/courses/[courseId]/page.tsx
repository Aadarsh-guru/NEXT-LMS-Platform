import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, File, IndianRupee, LayoutDashboard, ListChecks } from "lucide-react";
import prisma from "@/lib/prisma";
import IconBadge from "@/components/shared/IconBadge";
import TitleForm from "@/components/courses/TitleForm";
import DescriptionForm from "@/components/courses/DescriptionForm";
import ImageForm from "@/components/courses/ImageForm";
import CategoryForm from "@/components/courses/CategoryForm";
import PriceForm from "@/components/courses/PriceForm";
import AttachmentForm from "@/components/courses/AttachmentForm";
import ChaptersForm from "@/components/courses/ChaptersForm";
import CourseActions from "@/components/courses/CourseActions";
import Banner from "@/components/shared/Banner";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {

    const course = await prisma.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "asc"
                },
            },
        },
    });

    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    if (!course) {
        return redirect("/");
    }

    const requiredFeilds = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some((chapter) => chapter.isPublished),
    ];

    const totalFeilds = requiredFeilds.length;
    const completedFeilds = requiredFeilds.filter(Boolean).length;

    const completionText = `(${completedFeilds}/${totalFeilds})`;

    const isComplete = requiredFeilds.every(Boolean);

    return (
        <>
            {!course.isPublished && (
                <Banner
                    label="This course is unpublished. it will not be visible to the students."
                />
            )}
            <div className="p-6">
                <Link
                    href={`/dashboard/courses`}
                    className="flex items-center text-sm hover:opacity-75 transition mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to courses
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h2 className="text-2xl font-medium">
                            Course setup
                        </h2>
                        <span className="text-sm text-slate-700" >
                            Complete all feilds {completionText}
                        </span>
                    </div>
                    <CourseActions
                        disabled={!isComplete}
                        courseId={params.courseId}
                        isPublished={course.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">Customize your course</h2>
                        </div>
                        <TitleForm
                            courseId={course.id}
                            initialData={course}
                        />
                        <DescriptionForm
                            courseId={course.id}
                            initialData={course}
                        />
                        <ImageForm
                            courseId={course.id}
                            initialData={course}
                        />
                        <CategoryForm
                            courseId={course.id}
                            initialData={course}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl" >
                                    Course chapters
                                </h2>
                            </div>
                            <ChaptersForm
                                courseId={course.id}
                                initialData={course}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={IndianRupee} />
                                <h2 className="text-xl" >
                                    Sell your course
                                </h2>
                            </div>
                            <PriceForm
                                courseId={course.id}
                                initialData={course}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-xl" >
                                    Resources
                                </h2>
                            </div>
                            <AttachmentForm
                                courseId={course.id}
                                initialData={course}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CoursePage;