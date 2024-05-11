import express from "express";
import jwtTokenVerifier from "../middleware/jwtTokenVerifier";
import { body, validationResult } from "express-validator";
import {
    addUserToUserLibraries,
    forgotPassword,
    getUserProfile,
    loginUser,
    refreshToken,
    registerUser,
    sendVerificationEmail,
    updatePassword,
    verifyEmail,
} from "../controller/user.controller";
import verifyEmailVerifier from "../middleware/verifyEmailVerifier";
import resetTokenVerifier from "../middleware/resetTokenVerifier";
import {
    addUser,
    checkUserIsActiveByAdmin,
    deleteUserByIdentifier,
    editUserByAdmin,
    filterUsers,
    getAllUsersByAdmin,
    getUsersWithLibraryName,
} from "../controller/admin.controller";
import {
    getAllUsersByLibrarian,
    toggleUserActiveByLibrarian,
} from "../controller/librarian.controller";

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
        body("username")
            .not()
            .isEmpty()
            .escape()
            .withMessage("Name is required"),
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

userRouter.get("/profile", jwtTokenVerifier, getUserProfile);

// userRouter.post("/logout", logoutUser);

userRouter.post(
    "/sendEmail-verify",
    [body("email").isEmail().escape().withMessage("email is not valid")],

    sendVerificationEmail,
);
userRouter.post(
    "/verify-email",
    [
        body("email").isEmail().escape().withMessage("email is not valid"),
        body("verifyCode")
            .isLength({ min: 5, max: 5 })
            .escape()
            .withMessage("code is deficient"),
    ],

    verifyEmailVerifier,
    verifyEmail,
);

userRouter.post(
    "/forget-password",
    [body("email").isEmail().escape().withMessage("email is not valid")],

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
            .isLength({ min: 5, max: 5 })
            .escape()
            .withMessage("code is deficient"),
        body("email").isEmail().escape().withMessage("email is not valid"),
    ],

    resetTokenVerifier,
    updatePassword,
);
userRouter.post("/refresh-token", jwtTokenVerifier, refreshToken);
userRouter.post("/admin/addUser", jwtTokenVerifier, addUser);
userRouter.get("/admin/allUsers", jwtTokenVerifier, getAllUsersByAdmin);
userRouter.post("/admin/filter", jwtTokenVerifier, filterUsers);
userRouter.delete("/admin/delete", jwtTokenVerifier, deleteUserByIdentifier);
userRouter.put("/admin/edit", jwtTokenVerifier, editUserByAdmin);
userRouter.post("/admin/isActive", jwtTokenVerifier, checkUserIsActiveByAdmin);
userRouter.post(
    "/librarian/toggle-user-active",
    jwtTokenVerifier,
    toggleUserActiveByLibrarian,
);
userRouter.get("/librarian/allUsers", jwtTokenVerifier, getAllUsersByLibrarian);
userRouter.post(
    "/admin/getLibrarian",
    jwtTokenVerifier,
    getUsersWithLibraryName,
);
userRouter.post(
    "/addUserLibraraies",
    jwtTokenVerifier,
    addUserToUserLibraries,
);

export default userRouter;
