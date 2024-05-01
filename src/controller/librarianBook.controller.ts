import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
// import { User } from "../interface/models.interface";
import express from "express";
import { validationResult } from "express-validator";
import config from "../config/config";
import { generateRandomString } from "../utils/randomString";
import sendMail from "../utils/nodemailer";
import * as crypto from "crypto";
import {
    checkExpiredBooksForLibrarian,
    confirmBorrowForLibrarian,
    confirmReserveForLibrarian,
    confirmReturnForLibrarian,
    createBookWithGenres,
    deleteBookById,
    deleteReservation,
    deleteTransaction,
    findBooksByCriteriaForLibrarian,
    getBorrowedBooksForLibrarian,
    getReservationsForLibrarian,
    updateBook,
} from "../prisma/services/bookService";
import { findUserById } from "../prisma/services/userService";
import { BookFilters, BookType } from "../interface/models.interface";

export const addBookByLibrarian = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const {
            title,
            author,
            isbn,
            type,
            total_copies,
            available_copies,
            genreNames,
        } = req.body;
        const librarianId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const librarianUser = await findUserById(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        // Check if the user is a librarian
        if (
            librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator"
        ) {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }

        // Add the book
        const newBook = await createBookWithGenres(
            {
                title,
                author,
                isbn,
                type,
                total_copies,
                available_copies,
                library_name: librarianUser.library_name,
            },
            genreNames,
        );

        return res.status(200).json({
            success: true,
            msg: "Book added successfully",
            data: newBook,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, msg: "Internal server error" });
    }
};

// update book data by libraraian
export const updateBookByLibrarianAPI = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { bookId } = req.params;
        const {
            title,
            author,
            isbn,
            type,
            total_copies,
            available_copies,
            genreNames,
        } = req.body; // Assuming updatedBookData is sent in the request body
        const librarianId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const librarianUser = await findUserById(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        // Check if the user is a librarian
        if (
            librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator"
        ) {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        if (librarianUser.library_name === null) {
            return res
                .status(400)
                .json({ success: false, msg: "Library name is not available" });
        }
        const updatedBook = updateBook(
            librarianUser.library_name,
            parseInt(bookId),
            { title, author, isbn, type, total_copies, available_copies },
            genreNames,
        );

        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                msg: `Book with ID ${bookId} not found in the librarian's library`,
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Book updated successfully",
            data: updatedBook,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};

// delete book for libraraian
export const deleteBookByLibrarianAPI = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { bookId } = req.params;

        const librarianId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const librarianUser = await findUserById(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        // Check if the user is a librarian
        if (
            librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator"
        ) {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        if (librarianUser.library_name === null) {
            return res
                .status(400)
                .json({ success: false, msg: "Library name is not available" });
        }
        const deletedBook = deleteBookById(
            librarianUser.library_name,
            parseInt(bookId),
        );

        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                msg: `Book with ID ${bookId} not found in the librarian's library`,
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Book deleted successfully",
            data: deletedBook,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};

export const filterBooksForLibrarian = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const filters: BookFilters = {};
        const librarianID = req.cookies["userId"] || req.headers["id"];

        const librarianUser = await findUserById(parseInt(librarianID));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        if (librarianUser.role !== "librarian") {
            return res.status(401).json({
                success: false,
                msg: "You are not authorized to access this resource.",
            });
        }

        // Extract filters from the request query
        const { title, author, isbn, type, library_name, book_id } = req.query;
        if (title) filters.title = String(title);
        if (author) filters.author = String(author);
        if (isbn) filters.isbn = String(isbn);
        if (type) filters.type = String(type) as BookType;
        if (library_name) filters.library_name = String(library_name);
        if (book_id) filters.book_id = Number(book_id);

        // Check if any filter is provided
        if (Object.keys(filters).length === 0) {
            return res
                .status(400)
                .json({ success: false, msg: "Filter data is required." });
        }

        if (librarianUser.library_name) {
            const books = await findBooksByCriteriaForLibrarian(
                filters,
                librarianUser.library_name,
            );

            if (!books || books.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: "No books found matching the criteria.",
                });
            }
            return res.status(200).json({
                success: true,
                msg: "Books filtered successfully.",
                data: books,
            });
        } else {
            return res
                .status(200)
                .json({ success: false, msg: "you have no library in" });
        }
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        } else {
            return res.status(500).json({
                success: false,
                msg: "Unknown error in filtering books.",
            });
        }
    }
};

export const getRequestedBorrowBooks = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { state } = req.params;

        const librarianId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const librarianUser = await findUserById(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        // Check if the user is a librarian
        if (
            librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator"
        ) {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        if (librarianUser.library_name === null) {
            return res
                .status(400)
                .json({ success: false, msg: "Library name is not available" });
        }

        const data = await getBorrowedBooksForLibrarian(
            librarianUser.library_name,
            state,
        );

        if (!data) {
            return res.status(200).json({
                success: true,
                msg: "no transaction found",
            });
        } else {
            return res.status(200).json({
                success: true,
                msg: "success",
                data: data,
            });
        }
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};

export const getRequestedReservedBooks = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { status } = req.params;

        const librarianId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const librarianUser = await findUserById(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        // Check if the user is a librarian or administrator
        if (
            librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator"
        ) {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        if (librarianUser.library_name === null) {
            return res
                .status(400)
                .json({ success: false, msg: "Library name is not available" });
        }

        // Assuming getPendingReservationsForLibrarian function exists and takes librarian's library name and reservation state as parameters
        const data = await getReservationsForLibrarian(
            librarianUser.library_name,
            status,
        );

        if (!data || data.length === 0) {
            return res.status(200).json({
                success: true,
                msg: "No reservations found",
            });
        } else {
            return res.status(200).json({
                success: true,
                msg: "Success",
                data: data,
            });
        }
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "Unknown error" });
        }
    }
};

export const confirmBorrowForTheLibrarian = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { transactionId } = req.query;

        const librarianId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const librarianUser = await findUserById(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        // Check if the user is a librarian or administrator
        if (
            librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator"
        ) {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        if (librarianUser.library_name === null) {
            return res
                .status(400)
                .json({ success: false, msg: "Library name is not available" });
        }
        // Confirm borrow request
        const message = await confirmBorrowForLibrarian(
            librarianUser.library_name,
            parseInt(transactionId as string),
        );

        // Send response
        res.status(200).json({ success: true, msg: message });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "Unknown error" });
        }
    }
};

export const confirmReserveForTheLibrarian = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { reservationId } = req.query;

        const librarianId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const librarianUser = await findUserById(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        // Check if the user is a librarian or administrator
        if (
            librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator"
        ) {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }

        if (librarianUser.library_name === null) {
            return res
                .status(400)
                .json({ success: false, msg: "Library name is not available" });
        }
        // Confirm reservation
        const message = await confirmReserveForLibrarian(
            librarianUser.library_name,
            parseInt(reservationId as string),
        );

        // Send response
        res.status(200).json({ success: true, msg: message });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "Unknown error" });
        }
    }
};
export const deleteTransactionHandler = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { transactionId } = req.query;
        const userId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const user = await findUserById(parseInt(userId));
        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }
        // Delete the transaction
        const message = await deleteTransaction(parseInt(transactionId as string),parseInt(userId));

        res.status(200).json({ success: true, msg: message });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ success: false, msg: 'Failed to delete transaction' });
    }
};
export const deleteReservationHandler = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { reservationId } = req.query;
        const userId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const user = await findUserById(parseInt(userId));
        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }
        // Delete the transaction
        const message = await deleteReservation(parseInt(reservationId as string),parseInt(userId));

        res.status(200).json({ success: true, msg: message });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ success: false, msg: 'Failed to delete transaction' });
    }
};

export const confirmReturnForTheLibrarian = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { transactionId } = req.query;
        const librarianId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const librarianUser = await findUserById(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        // Check if the user is a librarian or administrator
        if (
            librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator"
        ) {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        if (librarianUser.library_name === null) {
            return res
                .status(400)
                .json({ success: false, msg: "Library name is not available" });
        }

        // Assuming confirmReturnForLibrarian function exists
        const message = await confirmReturnForLibrarian(
            librarianUser.library_name,
            parseInt(transactionId as string),
        );

        res.status(200).json({ success: true, msg: message });
    } catch (error) {
        console.error("Error confirming return request for librarian", error);
        res.status(500).json({
            success: false,
            msg: "Failed to confirm return request",
        });
    }
};
export const checkExpiredRequested = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        // const { state } = req.params;

        const librarianId = req.cookies["userId"] || req.headers["id"];

        // Find the librarian user
        const librarianUser = await findUserById(parseInt(librarianId));
        if (!librarianUser) {
            return res
                .status(401)
                .json({ success: false, msg: "Who are you? 🤔" });
        }

        // Check if the user is a librarian
        if (
            librarianUser.role !== "librarian" &&
            librarianUser.role !== "administrator"
        ) {
            return res.status(401).json({
                success: false,
                msg: "You do not have permission to perform this action. 😡",
            });
        }
        if (librarianUser.library_name === null) {
            return res
                .status(400)
                .json({ success: false, msg: "Library name is not available" });
        }

        // Get the requested borrow books data
        // const data = await getBorrowedBooksForLibrarian(
        //     librarianUser.library_name,
        //     state,
        // );

        // Check for expired books
        const { expiredBooks, notExpiredBooks } = await checkExpiredBooksForLibrarian(librarianUser.library_name);

       
            return res.status(200).json({
                success: true,
                msg: "Success",
                expiredBooks: expiredBooks,
                notExpiredBooks: notExpiredBooks
            });
        
    } catch (error) {
        console.error('Error retrieving requested borrow books for librarian:', error);
        return res.status(500).json({ success: false, msg: "Unknown error" });
    }
};
