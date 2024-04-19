"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserActiveByLibrarian = void 0;
const userService_1 = require("../prisma/userService");
const userLibraryService_1 = require("../prisma/userLibraryService");
const toggleUserActiveByLibrarian = async (req, res) => {
    try {
        const { identifier } = req.body;
        const librarianId = req.cookies["userId"] || req.headers["id"];
        // Find the librarian user
        const librarianUser = await (0, userService_1.findUserById)(parseInt(librarianId));
        if (!librarianUser) {
            return res.status(401).json({ success: false, msg: "Who are you? 🤔" });
        }
        // Check if the user is a librarian or administrator
        if (librarianUser.role !== "librarian" && librarianUser.role !== "administrator") {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        // Check if the identifier is provided
        if (!identifier) {
            return res.status(400).json({ success: false, msg: "Identifier is required" });
        }
        // Find the user by identifier
        const user = await (0, userService_1.findUserByIdentifier)(identifier);
        if (!user) {
            return res.status(400).json({ success: false, msg: "no user found" });
        }
        if (user.role === "administrator" || user.role === "librarian") {
            return res.status(400).json({ success: false, msg: "you have no permission for this user know your place" });
        }
        // Find the librarian's library name
        const librarianLibraryName = librarianUser.library_name;
        if (!librarianLibraryName) {
            return res.status(400).json({ success: false, msg: "you are not associated with any library" });
        }
        // Check if the user is associated with the librarian's library
        const userLibrary = await (0, userLibraryService_1.findUserLibrary)(user.user_id, librarianLibraryName);
        if (!userLibrary) {
            return res.status(400).json({ success: false, msg: "User is not associated with this library" });
        }
        // Toggle the user's active status in the User_Libraries table
        const isActive = !userLibrary.is_active;
        await (0, userLibraryService_1.updateUserLibraryActiveStatus)(identifier, librarianLibraryName, isActive);
        return res.status(200).json({ success: true, isActive });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res.status(500).json({ success: false, msg: "Unknown error" });
        }
    }
};
exports.toggleUserActiveByLibrarian = toggleUserActiveByLibrarian;
//# sourceMappingURL=librarian.controller.js.map