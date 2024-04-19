"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserLibraryActiveStatus = exports.findUserLibrary = void 0;
const client_1 = require("@prisma/client");
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
//# sourceMappingURL=userLibraryService.js.map