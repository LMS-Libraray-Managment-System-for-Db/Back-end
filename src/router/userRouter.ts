import express from "express";
import jwtTokenVerifier from "../middleware/jwtTokenVerifier";
import { body, validationResult } from "express-validator";
import {
    
    forgotPassword,
    getUserProfile,
    loginUser,
    registerUser,
    sendVerificationEmail,
    updatePassword,
    verifyEmail
    
} from "../controller/user.controller";
import tokenVerifier from "../middleware/resetTokenVerifier";
import verifyEmailVerifier from "../middleware/verifyEmailVerifier";
import resetTokenVerifier from "../middleware/resetTokenVerifier";

// let upload = multer();
const userRouter: express.Router = express.Router();

// userRouter.use(upload.array());
userRouter.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).json({
        msg: "main router for users",
    });
});
userRouter.post(
    "/register",
    [
        body("username").not().isEmpty().escape().withMessage("Name is required"),
        body("email").isEmail().escape().withMessage("email isnot valid"),
        body("password")
            .isLength({ min: 8, max: 20 })
            .escape()
            .withMessage("min 8 , max 20 char required for password"),
    ],
    registerUser,
);

userRouter.post(
    "/login",
    [
        body("email").isEmail().escape().withMessage("email is not valid"),
        body("password")
            .isLength({ min: 5 })
            .escape()
            .withMessage("min 5 characters required for password"),
    ],
    loginUser,
);

userRouter.get("/profile", jwtTokenVerifier,getUserProfile);

// userRouter.post("/logout", logoutUser);

userRouter.post(
    "/sendEmail-verify",
    [body("email").isEmail().escape().withMessage("email is not valid")],
    jwtTokenVerifier,

    sendVerificationEmail,
);
userRouter.post(
    "/verify-email",
    [body("email").isEmail().escape().withMessage("email is not valid"),
    body("verifyCode")
            .isLength({ min: 5, max:5 })
            .escape()
            .withMessage("code is deficient")],
            jwtTokenVerifier,
    verifyEmailVerifier,
    verifyEmail,
);

userRouter.post(
    "/forget-password",
    [body("email").isEmail().escape().withMessage("email is not valid")],
     jwtTokenVerifier,

    forgotPassword,
);

userRouter.put(
    "/reset-password",
    [
        body("password")
            .isLength({ min: 5 })
            .escape()
            .withMessage("min 5 characters required for password"),
            body("token")
                    .isLength({ min: 5, max:5 })
                    .escape()
                    .withMessage("code is deficient")
    ],

    jwtTokenVerifier,
    resetTokenVerifier,
    updatePassword,
);
// userRouter.post(
//     "/refresh-token",
//     refreshToken,
// );

export default userRouter;
