"use server";
import prisma from "@/lib/prisma";
import { deleteMediaAction } from "./media";

const createAttachmentAction = async (courseId: string, { url }: { url: string }) => {
    try {
        const attachment = await prisma.attachment.create({
            data: {
                url,
                name: url.split('/').pop()!,
                courseId: courseId,
            }
        });
        return {
            message: 'Attachment added successfully!',
            success: true,
            attachment
        };
    } catch (error) {
        throw error;
    }
};

const deleteAttachmentAction = async (courseId: string, id: string) => {
    try {
        const attachment = await prisma.attachment.delete({
            where: {
                id: id,
                courseId: courseId,
            }
        });
        await deleteMediaAction(attachment.url);
        return {
            message: 'Attachment deleted successfully!',
            success: true,
            attachment
        };
    } catch (error) {
        throw error;
    }
}

export {
    createAttachmentAction,
    deleteAttachmentAction,
};