import express from "express";
import jwtTokenVerifier from "../middleware/jwtTokenVerifier";
import { body, validationResult } from "express-validator";
import verifyEmailVerifier from "../middleware/verifyEmailVerifier";
import resetTokenVerifier from "../middleware/resetTokenVerifier";
import { addGenresController, deleteGenreController, getAllGenresApi } from "../controller/genere.controller";


const genreRouter: express.Router = express.Router();
genreRouter.post(
    "/add",
    jwtTokenVerifier,
    addGenresController,
);
genreRouter.get(
    "/all",
    jwtTokenVerifier,
    getAllGenresApi,
);

genreRouter.delete(
    "/delete/:genreId",
    jwtTokenVerifier,
    deleteGenreController,
);


export default genreRouter;