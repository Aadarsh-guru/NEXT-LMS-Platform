import Link from "next/link";
import { redirect } from "next/navigation";
import IconBadge from "@/components/shared/IconBadge";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import ChapterTitleForm from "@/components/chapters/ChapterTitleForm";
import ChapterDescriptionForm from "@/components/chapters/ChapterDescriptionForm";
import ChapterAccessForm from "@/components/chapters/ChapterAccessForm";
import ChapterAddVideoForm from "@/components/chapters/ChapterAddVideoForm";
import ChapterActions from "@/components/chapters/ChapterActions";
import Banner from "@/components/shared/Banner";
import prisma from "@/lib/prisma";


const ChapterIdPage = async ({ params }: { params: { chapterId: string, courseId: string } }) => {


    const chapter = await prisma.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        }
    });

    if (!chapter) {
        return redirect("/");
    };

    const requiredFeilds = [
        chapter.title,
        chapter.description,
        chapter?.resolutions?.length > 0,
    ];

    const totalFeilds = requiredFeilds.length;
    const completedFeilds = requiredFeilds.filter(Boolean).length;

    const completionText = `(${completedFeilds}/${totalFeilds})`;

    const isComplete = requiredFeilds.every(Boolean);

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant={'warning'}
                    label="This chapter is not published yet. It will not be visible in the course."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/dashboard/courses/${params.courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium" >Chapter creation</h1>
                                <span className="text-sm text-sky-500" >
                                    Complete all feilds {completionText}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl" >Customize your chapter</h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl" >Access settings</h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl" >Add a video</h2>
                        </div>
                        <ChapterAddVideoForm
                            initialData={chapter}
                            chapterId={params.chapterId}
                            courseId={params.courseId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChapterIdPage;