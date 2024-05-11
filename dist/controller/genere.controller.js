"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGenreController = exports.addGenresController = exports.getAllGenresApi = void 0;
const genereService_1 = require("../prisma/services/genereService");
const userService_1 = require("../prisma/services/userService");
const getAllGenresApi = async (req, res) => {
    try {
        const librarianId = req.cookies["userId"] || req.headers["id"];
        const librarianUser = await (0, userService_1.findUserById)(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }
        // Check if the user is a librarian
        if (librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator") {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        const genres = await (0, genereService_1.getAllGenres)();
        return res.status(200).json({ success: true, msg: "genre sended successfully", data: genres });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};
exports.getAllGenresApi = getAllGenresApi;
const addGenresController = async (req, res) => {
    try {
        const { names } = req.body;
        const librarianId = req.cookies["userId"] || req.headers["id"];
        const librarianUser = await (0, userService_1.findUserById)(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }
        // Check if the user is a librarian
        if (librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator") {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        const newGenres = await (0, genereService_1.addGenres)(names);
        return res.status(201).json({ success: true, msg: "genre updated successfully", genres: newGenres });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};
exports.addGenresController = addGenresController;
// delete genere
const deleteGenreController = async (req, res) => {
    try {
        const { genreId } = req.params;
        const librarianId = req.cookies["userId"] || req.headers["id"];
        const librarianUser = await (0, userService_1.findUserById)(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }
        // Check if the user is a librarian
        if (librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator") {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        const deletedGenre = await (0, genereService_1.deleteGenre)(parseInt(genreId));
        return res.status(200).json({ success: true, msg: "genre deleted successfully", deletedGenre });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};
exports.deleteGenreController = deleteGenreController;
//# sourceMappingURL=genere.controller.js.map