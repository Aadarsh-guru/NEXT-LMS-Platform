import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { BookOpen, CheckCircle, File, IndianRupee } from "lucide-react";
import prisma from "@/lib/prisma";
import authOptions from "@/lib/auth";
import IconBadge from "@/components/shared/IconBadge";
import { Button } from "@/components/ui/button";
import CourseEnrollButton from "@/components/courses/CourseEnrollButton";
import Preview from "@/components/shared/Preview";

interface CourseIdPageProps {
    params: {
        courseId: string;
    };
};

export async function generateMetadata({ params }: CourseIdPageProps) {
    const course = await prisma.course.findUnique({
        where: {
            id: params.courseId,
        },
        select: {
            title: true,
            description: true,
        }
    })
    return {
        title: `${course?.title}`,
        description: `${course?.description}`,
    };
};

const CourseIdPage = async ({ params }: CourseIdPageProps) => {

    const session = await getServerSession(authOptions);

    const isPurchased = await prisma.purchase.findFirst({
        where: {
            courseId: params.courseId,
            // @ts-expect-error
            userId: session?.user?.id
        },
        select: {
            id: true,
        }
    });

    const course = await prisma.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                orderBy: {
                    position: "asc"
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        },
    });

    return (
        <div className="p-6">
            <div className="relative aspect-video">
                <Image
                    src={course?.imageUrl!}
                    className="object-cover rounded-lg"
                    alt="course-image"
                    fill
                />
            </div>
            <h1 className="text-2xl font-bold mt-4 text-sky-700">{course?.title}</h1>
            <div className="mt-4 w-full flex flex-col-reverse lg:flex-row gap-4 lg:items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap text-slate-500">
                    <div className="flex items-center gap-x-1">
                        <IconBadge icon={BookOpen} />
                        <span>
                            {course?.chapters.length} {course?.chapters.length === 1 ? "Chapter" : "Chapters"}
                        </span>
                    </div>
                    {course?.attachments?.length! > 0 && (
                        <div className="flex items-center gap-x-1">
                            <IconBadge icon={File} />
                            <span>
                                {course?.chapters.length} {course?.chapters.length === 1 ? "Attachment" : "Attachments"}
                            </span>
                        </div>
                    )}
                </div>
                {!isPurchased && (
                    <CourseEnrollButton courseId={course?.id!} price={course?.price!} >
                        <IndianRupee className="h-4 w-4 mr-1" />
                        <p className="mr-2" >
                            {course?.price}
                        </p>
                        Enroll now
                    </CourseEnrollButton>
                )}
                {isPurchased && (
                    <div className="flex items-center gap-x-1">
                        <IconBadge variant={'success'} icon={CheckCircle} />
                        <Link href={`/courses/${course?.id}/chapters/${course?.chapters[0]?.id}`}>
                            <Button variant={'outline'} >
                                Start course
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
            {(isPurchased && course?.attachments?.length! > 0) && (
                <div className="mt-8">
                    <div className="w-full flex items-center">
                        <h3 className="font-bold text-xl lg:text-2xl text-black/80" >Course Assets</h3>
                    </div>
                    <div className="mt-4">
                        {course?.attachments?.map((attachment, index) => (
                            <div className="mt-2 flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md" key={index}>
                                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                <a href={attachment.url} target="_blank" rel="noreferrer" className="text-sky-700 text-sm line-clamp-1">{attachment.name}</a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="mt-8">
                <div className="w-full flex items-center">
                    <h3 className="font-bold text-xl lg:text-2xl text-black/80" >Course description</h3>
                </div>
                <div className="mt-4">
                    <Preview
                        value={course?.description!}
                    />
                </div>
            </div>
        </div>
    );

};

export default CourseIdPage;