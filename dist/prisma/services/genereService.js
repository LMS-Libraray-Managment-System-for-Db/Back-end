"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGenre = exports.getGenreIds = exports.addGenres = exports.getAllGenres = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getAllGenres() {
    try {
        const genres = await prisma.genres.findMany();
        return genres;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error getting generes: ${error.message}`);
        }
        else {
            throw new Error(`Error getting generes: Unknown error occurred`);
        }
    }
}
exports.getAllGenres = getAllGenres;
async function addGenres(names) {
    try {
        console.log("Names:", names); // Log the received names array
        const existingGenres = await prisma.genres.findMany({
            where: {
                name: {
                    in: names,
                },
            },
        });
        console.log("Existing genres:", existingGenres); // Log the existing genres
        // Filter out existing genres from the names array
        const newNames = names.filter((name) => !existingGenres.some((genre) => genre.name === name));
        console.log("New names:", newNames); // Log the new names after filtering
        // Create new genres
        const newGenres = await prisma.genres.createMany({
            data: newNames.map((name) => ({ name })),
        });
        console.log("New genres:", newGenres); // Log the newly created genres
        return newGenres;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error adding generes: ${error.message}`);
        }
        else {
            throw new Error(`Error adding generes: Unknown error occurred`);
        }
    }
}
exports.addGenres = addGenres;
async function getGenreIds(genreNames) {
    try {
        const genres = await prisma.genres.findMany({
            where: {
                name: {
                    in: genreNames,
                },
            },
        });
        return genres.map((genre) => genre.genre_id);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error getting generes ids: ${error.message}`);
        }
        else {
            throw new Error(`Error getting generes ids: Unknown error occurred`);
        }
    }
}
exports.getGenreIds = getGenreIds;
async function deleteGenre(genreId) {
    try {
        // Delete the genre
        const deletedGenre = await prisma.genres.delete({
            where: { genre_id: genreId },
        });
        return deletedGenre;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error deleting genere by id: ${error.message}`);
        }
        else {
            throw new Error(`Error deleting genere by id: Unknown error occurred`);
        }
    }
}
exports.deleteGenre = deleteGenre;
//# sourceMappingURL=genereService.js.map