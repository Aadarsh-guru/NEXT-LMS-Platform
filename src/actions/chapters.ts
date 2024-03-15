"use server";
import prisma from "@/lib/prisma";
import { deleteMediaAction } from "./media";


const createChapterAction = async (courseId: string, { title }: { title: string }) => {
    try {
        const lastChapter = await prisma.chapter.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                position: "desc"
            }
        });
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;
        const chapter = await prisma.chapter.create({
            data: {
                title,
                courseId: courseId,
                position: newPosition,
            }
        });
        return {
            message: 'Chapter created successfully!',
            success: true,
            chapter
        };
    } catch (error) {
        throw error;
    }
};

const reorderChaptersAction = async (courseId: string, list: any) => {
    try {
        for (let item of list) {
            await prisma.chapter.update({
                where: {
                    id: item.id,
                },
                data: {
                    position: item.position
                }
            });
        }
        return {
            message: 'Chapter reordered!',
            success: true,
        };
    } catch (error) {
        throw error;
    }
};

const updateChapterAction = async (chapterId: string, courseId: string, values: any) => {
    try {
        const chapter = await prisma.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values,
            }
        });
        return {
            message: 'Chapter updated successfully!',
            success: true,
            chapter
        };
    } catch (error) {
        throw error;
    }
};

const deleteChapterAction = async (chapterId: string, courseId: string) => {
    try {

        const deletedChapter = await prisma.chapter.delete({
            where: {
                id: chapterId,
                courseId: courseId
            }
        });

        deletedChapter.resolutions.map(async (resolution) => {
            await deleteMediaAction(resolution);
        });

        const publishedChaptersInCourse = await prisma.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            }
        });

        if (!publishedChaptersInCourse.length) {
            await prisma.course.update({
                where: {
                    id: courseId
                },
                data: {
                    isPublished: false
                }
            });
        }

        return {
            message: 'Chapter deleted successfully!',
            success: true,
            chapter: deletedChapter
        };
    } catch (error) {
        throw error;
    }
};

const publishChapterAction = async (chapterId: string, courseId: string) => {
    try {
        const publishedChapter = await prisma.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: true
            }
        });
        return {
            message: 'Chapter published successfully!',
            success: true,
            chapter: publishedChapter
        };
    } catch (error) {
        throw error;
    }
};

const unpublishChapterAction = async (chapterId: string, courseId: string) => {

    const unpublishedChapter = await prisma.chapter.update({
        where: {
            id: chapterId,
            courseId: courseId
        },
        data: {
            isPublished: false
        }
    });

    const publishedChaptersInCourse = await prisma.chapter.findMany({
        where: {
            courseId: courseId,
            isPublished: true
        }
    });

    if (!publishedChaptersInCourse.length) {
        await prisma.course.update({
            where: {
                id: courseId
            },
            data: {
                isPublished: false
            }
        });
    }

    return {
        message: 'Chapter unpublished successfully!',
        success: true,
        chaper: unpublishedChapter
    };
};

export {
    createChapterAction,
    reorderChaptersAction,
    updateChapterAction,
    deleteChapterAction,
    publishChapterAction,
    unpublishChapterAction,
};