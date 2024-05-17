import { PrismaClient } from '@prisma/client';
import { getAllLibrariesWithLibrarians } from './userService';

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

export async function addUserLibrariesForPatron(userId: number) {
    try {
        // Get all libraries with librarians
        const libraries = await getAllLibrariesWithLibrarians();
        
        // Iterate through each library and add user libraries for the patron user
        for (const library of libraries) {
            // Check if the user library already exists
            const existingUserLibrary = await prisma.user_libraries.findUnique({
                where: {
                    user_id_library_name: {
                        user_id: userId,
                        library_name: String(library),
                    },
                },
            });

            // If the user library does not exist, create it
            if (!existingUserLibrary) {
                await prisma.user_libraries.create({
                    data: {
                        user_id: userId,
                        library_name: String(library),
                        is_active: true,
                    },
                });
            }
        }

        console.log(`User libraries for patron user ${userId} added successfully`);
        return `User libraries for user added successfully`;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error adding user libraries for patron user ${userId}: ${error.message}`);
        } else {
            throw new Error(`Error adding user libraries for patron user ${userId}: Unknown error occurred`);
        }
    }
}


