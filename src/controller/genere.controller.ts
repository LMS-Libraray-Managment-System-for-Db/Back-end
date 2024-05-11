import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
// import { User } from "../interface/models.interface";
import express from "express";
import { addGenres, deleteGenre, getAllGenres } from "../prisma/services/genereService";
import { validationResult } from "express-validator";
import config from "../config/config";
import { generateRandomString } from "../utils/randomString";
import sendMail from "../utils/nodemailer";
import * as crypto from "crypto";

import { findUserById } from "../prisma/services/userService";


export const getAllGenresApi = async (req: express.Request, res: express.Response) => {
    try {
        
        const librarianId = req.cookies["userId"] || req.headers["id"];
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
        const genres = await getAllGenres();
        return res.status(200).json({ success: true,msg: "genre sended successfully",data: genres });
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
export const addGenresController = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { names } = req.body;
        const librarianId = req.cookies["userId"] || req.headers["id"];
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
        const newGenres = await addGenres(names);
        return res.status(201).json({ success: true,msg: "genre updated successfully", genres: newGenres });
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

// delete genere
export const deleteGenreController = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { genreId } = req.params;
        const librarianId = req.cookies["userId"] || req.headers["id"];
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

        const deletedGenre = await deleteGenre(parseInt(genreId));
        return res.status(200).json({ success: true, msg: "genre deleted successfully", deletedGenre });
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
