import express from "express";
import jwtTokenVerifier from "../middleware/jwtTokenVerifier";
import { body, validationResult } from "express-validator";
import verifyEmailVerifier from "../middleware/verifyEmailVerifier";
import resetTokenVerifier from "../middleware/resetTokenVerifier";

const bookRouter: express.Router = express.Router();



export default bookRouter;