import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserLibrary = async (userId: number, libraryName: string) => {
    try {
        const userLibrary = await prisma.user_libraries.findFirst({
            where: {
                user_id: userId,
                library_name: libraryName
            }
        });
        return userLibrary;
    } catch (error) {
        console.error(error);
        throw new Error("Error finding user's library association");
    }
};

export const updateUserLibraryActiveStatus = async (userId: number, libraryName: string, isActive: boolean) => {
    try {
        const updatedUserLibrary = await prisma.user_libraries.update({
            where: {
                user_id_library_name: {
                    user_id: userId,
                    library_name: libraryName
                }
            },
            data: {
                is_active: isActive
            }
        });
        return updatedUserLibrary;
    } catch (error) {
        console.error(error);
        throw new Error("Error updating user's library active status");
    }
};