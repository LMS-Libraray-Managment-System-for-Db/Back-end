import { PrismaClient } from "@prisma/client";
import { Book, BookFilters} from "../interface/models.interface";



const prisma = new PrismaClient();

// Function to create a new book
export async function createBook(bookData: Book) {
    try {
        const newBook = await prisma.books.create({ data: bookData });
        return newBook;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error creating book: ${error.message}`);
        } else {
            throw new Error(`Error creating book: Unknown error occurred`);
        }
    }
}

// Function to find a book by its ID
export async function findBookById(bookId: number) {
    try {
        const book = await prisma.books.findUnique({
            where: { book_id: bookId }
        });
        return book;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error finding book by id: ${error.message}`);
        } else {
            throw new Error(`Error finding book by id: Unknown error occurred`);
        }
    }
}

// Function to update a book's information
export async function updateBook(bookId: number, updatedBookData: Partial<Book>) {
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
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error updating book: ${error.message}`);
        } else {
            throw new Error(`Error updating book: Unknown error occurred`);
        }
    }
};

// Function to delete a book by its ID
export async function deleteBookById(bookId: number) {
    try {
        const deletedBook = await prisma.books.delete({
            where: { book_id: bookId }
        });
        return deletedBook;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error deleting book by id: ${error.message}`);
        } else {
            throw new Error(`Error deleting book by id: Unknown error occurred`);
        }
}};

// Function to find books by specific criteria
export async function findBooksByCriteria(criteria: BookFilters) {
    try {
        const books = await prisma.books.findMany({
            where: criteria
        });
        return books;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error finding book by criteria: ${error.message}`);
        } else {
            throw new Error(`Error finding book by criteria: Unknown error occurred`);
        }
    }
}