"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserLibrariesForPatron = exports.updateUserLibraryActiveStatus = exports.findUserLibrary = void 0;
const client_1 = require("@prisma/client");
const userService_1 = require("./userService");
const prisma = new client_1.PrismaClient();
const findUserLibrary = async (userId, libraryName) => {
    try {
        const userLibrary = await prisma.user_libraries.findFirst({
            where: {
                user_id: userId,
                library_name: libraryName
            }
        });
        return userLibrary;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error finding user's library association");
    }
};
exports.findUserLibrary = findUserLibrary;
const updateUserLibraryActiveStatus = async (userId, libraryName, isActive) => {
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
    }
    catch (error) {
        console.error(error);
        throw new Error("Error updating user's library active status");
    }
};
exports.updateUserLibraryActiveStatus = updateUserLibraryActiveStatus;
async function addUserLibrariesForPatron(userId) {
    try {
        // Get all libraries with librarians
        const libraries = await (0, userService_1.getAllLibrariesWithLibrarians)();
        // Iterate through each library and add user libraries for the patron user
        for (const library of libraries) {
            await prisma.user_libraries.create({
                data: {
                    user_id: userId,
                    library_name: String(library),
                    is_active: true
                }
            });
        }
        console.log(`User libraries for patron user ${userId} added successfully`);
        return `User libraries for  user added successfully`;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error adding user libraries for patron user ${userId}: ${error.message}`);
        }
        else {
            throw new Error(`Error adding user libraries for patron user ${userId}: Unknown error occurred`);
        }
    }
}
exports.addUserLibrariesForPatron = addUserLibrariesForPatron;
;
//# sourceMappingURL=user%D9%8BWithLibrarianService.js.map