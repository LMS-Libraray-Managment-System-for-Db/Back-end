"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtTokenVerifier_1 = __importDefault(require("../middleware/jwtTokenVerifier"));
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controller/user.controller");
const verifyEmailVerifier_1 = __importDefault(require("../middleware/verifyEmailVerifier"));
const resetTokenVerifier_1 = __importDefault(require("../middleware/resetTokenVerifier"));
const admin_controller_1 = require("../controller/admin.controller");
const librarian_controller_1 = require("../controller/librarian.controller");
// let upload = multer();
const userRouter = express_1.default.Router();
// userRouter.use(upload.array());
userRouter.get("/", (req, res) => {
    res.status(200).json({
        msg: "main router for users",
    });
});
userRouter.post("/register", [
    (0, express_validator_1.body)("username")
        .not()
        .isEmpty()
        .escape()
        .withMessage("Name is required"),
    (0, express_validator_1.body)("email").isEmail().escape().withMessage("email isnot valid"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8, max: 20 })
        .escape()
        .withMessage("min 8 , max 20 char required for password"),
], user_controller_1.registerUser);
userRouter.post("/login", [
    (0, express_validator_1.body)("email").isEmail().escape().withMessage("email is not valid"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 5 })
        .escape()
        .withMessage("min 5 characters required for password"),
], user_controller_1.loginUser);
userRouter.get("/profile", jwtTokenVerifier_1.default, user_controller_1.getUserProfile);
// userRouter.post("/logout", logoutUser);
userRouter.post("/sendEmail-verify", [(0, express_validator_1.body)("email").isEmail().escape().withMessage("email is not valid")], user_controller_1.sendVerificationEmail);
userRouter.post("/verify-email", [
    (0, express_validator_1.body)("email").isEmail().escape().withMessage("email is not valid"),
    (0, express_validator_1.body)("verifyCode")
        .isLength({ min: 5, max: 5 })
        .escape()
        .withMessage("code is deficient"),
], verifyEmailVerifier_1.default, user_controller_1.verifyEmail);
userRouter.post("/forget-password", [(0, express_validator_1.body)("email").isEmail().escape().withMessage("email is not valid")], user_controller_1.forgotPassword);
userRouter.put("/reset-password", [
    (0, express_validator_1.body)("password")
        .isLength({ min: 5 })
        .escape()
        .withMessage("min 5 characters required for password"),
    (0, express_validator_1.body)("token")
        .isLength({ min: 5, max: 5 })
        .escape()
        .withMessage("code is deficient"),
    (0, express_validator_1.body)("email").isEmail().escape().withMessage("email is not valid"),
], resetTokenVerifier_1.default, user_controller_1.updatePassword);
userRouter.post("/refresh-token", jwtTokenVerifier_1.default, user_controller_1.refreshToken);
userRouter.post("/admin/addUser", jwtTokenVerifier_1.default, admin_controller_1.addUser);
userRouter.get("/admin/allUsers", jwtTokenVerifier_1.default, admin_controller_1.getAllUsersByAdmin);
userRouter.post("/admin/filter", jwtTokenVerifier_1.default, admin_controller_1.filterUsers);
userRouter.delete("/admin/delete", jwtTokenVerifier_1.default, admin_controller_1.deleteUserByEmailOrUsername);
userRouter.put("/admin/edit", jwtTokenVerifier_1.default, admin_controller_1.editUserByAdmin);
userRouter.post("/admin/isActive", jwtTokenVerifier_1.default, admin_controller_1.checkUserIsActiveByAdmin);
userRouter.post("/librarian/toggle-user-active", jwtTokenVerifier_1.default, librarian_controller_1.toggleUserActiveByLibrarian);
userRouter.post("/admin/getLibrarian", jwtTokenVerifier_1.default, admin_controller_1.getUsersWithLibraryName);
userRouter.post("/addUserLibraraies/:userId", jwtTokenVerifier_1.default, user_controller_1.addUserToUserLibraries);
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map