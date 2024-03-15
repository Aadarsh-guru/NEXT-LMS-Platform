"use server";
import prisma from "@/lib/prisma";

const createCategoryAction = async (name: string) => {
    try {
        const category = await prisma.category.create({
            data: {
                name
            }
        });
        return {
            success: true,
            message: "Category created successfully",
            category,
        };
    } catch (error) {
        throw error;
    }
};

const updateCategoryAction = async (id: string, name: string) => {
    try {
        const category = await prisma.category.update({
            where: {
                id
            },
            data: {
                name
            }
        });
        return {
            success: true,
            message: "Category updated successfully",
            category,
        };
    } catch (error) {
        throw error;
    }
};

const deleteCategoryAction = async (id: string) => {
    try {
        const category = await prisma.category.delete({
            where: {
                id
            }
        });
        return {
            success: true,
            message: "Category deleted successfully",
            category,
        };
    } catch (error) {
        throw error;
    }
};

export {
    createCategoryAction,
    updateCategoryAction,
    deleteCategoryAction,
};