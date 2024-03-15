import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { message, resolutions } = await request.json();
        const parsedUrl = new URL(resolutions[0]);
        const pathname = parsedUrl.pathname;
        const segments = pathname.split('/');
        const chapterId = segments[segments.length - 2];
        await prisma.chapter.update({
            where: { id: chapterId },
            data: {
                resolutions: resolutions,
                isVideoProcessing: false,
            },
            select: { courseId: true }
        });
        return new Response(message, { status: 200 });
    } catch (error: any) {
        return new Response(error.message, { status: 500 })
    };
};