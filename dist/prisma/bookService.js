"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBooksByCriteria = exports.deleteBookById = exports.updateBook = exports.findBookById = exports.createBook = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Function to create a new book
async function createBook(bookData) {
    try {
        const newBook = await prisma.books.create({ data: bookData });
        return newBook;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error creating book: ${error.message}`);
        }
        else {
            throw new Error(`Error creating book: Unknown error occurred`);
        }
    }
}
exports.createBook = createBook;
// Function to find a book by its ID
async function findBookById(bookId) {
    try {
        const book = await prisma.books.findUnique({
            where: { book_id: bookId }
        });
        return book;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error finding book by id: ${error.message}`);
        }
        else {
            throw new Error(`Error finding book by id: Unknown error occurred`);
        }
    }
}
exports.findBookById = findBookById;
// Function to update a book's information
async function updateBook(bookId, updatedBookData) {
    try {
        const existingBook = await prisma.books.findUnique({ where: { book_id: bookId } });
        if (!existingBook) {
            return null;
        }
        const updatedBook = await prisma.books.update({
            where: { book_id: bookId },
            data: updatedBookData,
        });
        return updatedBook;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error updating book: ${error.message}`);
        }
        else {
            throw new Error(`Error updating book: Unknown error occurred`);
        }
    }
}
exports.updateBook = updateBook;
;
// Function to delete a book by its ID
async function deleteBookById(bookId) {
    try {
        const deletedBook = await prisma.books.delete({
            where: { book_id: bookId }
        });
        return deletedBook;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error deleting book by id: ${error.message}`);
        }
        else {
            throw new Error(`Error deleting book by id: Unknown error occurred`);
        }
    }
}
exports.deleteBookById = deleteBookById;
;
// Function to find books by specific criteria
async function findBooksByCriteria(criteria) {
    try {
        const books = await prisma.books.findMany({
            where: criteria
        });
        return books;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error finding book by criteria: ${error.message}`);
        }
        else {
            throw new Error(`Error finding book by criteria: Unknown error occurred`);
        }
    }
}
exports.findBooksByCriteria = findBooksByCriteria;
//# sourceMappingURL=bookService.js.map