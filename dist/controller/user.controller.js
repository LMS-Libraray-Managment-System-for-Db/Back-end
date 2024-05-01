"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToUserLibraries = exports.refreshToken = exports.updatePassword = exports.forgotPassword = exports.verifyEmail = exports.sendVerificationEmail = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const gravatar_1 = __importDefault(require("gravatar"));
const express_validator_1 = require("express-validator");
const config_1 = __importDefault(require("../config/config"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const crypto = __importStar(require("crypto"));
const userService_1 = require("../prisma/services/userService");
const user_WithLibrarianService_1 = require("../prisma/services/user\u064BWithLibrarianService");
const registerUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const { username, email, password, account_type } = req.body;
        const avatar = gravatar_1.default.url(email, { s: "300", r: "pg", d: "mm" });
        console.log(avatar);
        const verificationCode = crypto.randomInt(10000, 99999).toString();
        // Check if user already exists with the email
        const existingUser = await (0, userService_1.findUserByEmail)(email);
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, msg: "Email already exists" });
        }
        // Encrypt password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashPass = await bcryptjs_1.default.hash(password, salt);
        // Get avatar URL
        // Register user
        const newUser = await (0, userService_1.createUser)({
            username: username.toLowerCase(),
            password: hashPass,
            email: email,
            account_type: account_type,
            role: "patron",
            verificationCode: verificationCode,
            verified: false,
            avatar: avatar,
            is_active: false,
        });
        // Generate JWT tokens
        const secretKey = process.env.JWT_SECRET_KEY || config_1.default.secret_jwt;
        if (!secretKey) {
            return res
                .status(500)
                .json({ success: false, msg: "JWT secret key not available" });
        }
        const payLoad = {
            user: {
                id: newUser.user_id,
                username: newUser.username,
                role: newUser.role,
                account_type: newUser.account_type,
            },
        };
        const access_expirationTime = Math.floor(Date.now() / 1000) + 1 * 60 * 60; // 1 hour from now
        const refresh_expirationTime = Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60; // 10 days from now
        const access_token = jsonwebtoken_1.default.sign({ exp: access_expirationTime, payLoad }, secretKey);
        const refresh_token = jsonwebtoken_1.default.sign({ exp: refresh_expirationTime, payLoad }, secretKey);
        // Set tokens in response headers
        res.header("access_token", access_token);
        res.header("refresh_token", refresh_token);
        // Return success response
        return res.status(200).json({
            success: true,
            msg: "Registration is successful",
            refresh_token: refresh_token,
            token: access_token,
            role: newUser.role,
            account_type: newUser.account_type,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};
exports.registerUser = registerUser;
//login user
const loginUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await (0, userService_1.findUserByEmail)(email);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: "Invalid email or password" });
        }
        // Check if password is correct
        const isMatch = await (0, userService_1.comparePasswords)(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, msg: "Invalid email or password" });
        }
        // Generate JWT tokens
        const secretKey = process.env.JWT_SECRET_KEY || config_1.default.secret_jwt;
        if (!secretKey) {
            return res
                .status(500)
                .json({ success: false, msg: "JWT secret key not available" });
        }
        const payLoad = {
            user: {
                id: user.user_id,
                username: user.username,
                role: user.role,
                account_type: user.account_type,
            },
        };
        const access_expirationTime = Math.floor(Date.now() / 1000) + 1 * 60 * 60; // 1 hour from now
        const refresh_expirationTime = Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60; // 10 days from now
        const access_token = jsonwebtoken_1.default.sign({ exp: access_expirationTime, payLoad }, secretKey);
        const refresh_token = jsonwebtoken_1.default.sign({ exp: refresh_expirationTime, payLoad }, secretKey);
        // Set tokens in response headers
        res.header("access_token", access_token);
        res.header("refresh_token", refresh_token);
        // Return success response
        return res.status(200).json({
            success: true,
            msg: "Login successful",
            refresh_token: refresh_token,
            token: access_token,
            role: user.role,
            account_type: user.account_type,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown errror" });
        }
    }
};
exports.loginUser = loginUser;
// get user data
const getUserProfile = async (req, res) => {
    try {
        // Extract user ID from request params
        const username = req.cookies["userName"] || req.headers["user"];
        const userId = req.cookies["userId"] || req.headers["id"];
        // Find user by ID
        const user = await (0, userService_1.findUserById)(parseInt(userId));
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }
        // Return user profile
        return res.status(200).json({ success: true, user });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};
exports.getUserProfile = getUserProfile;
//send verification email
const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await (0, userService_1.findUserByEmail)(email);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: "No email found" });
        }
        if ((user === null || user === void 0 ? void 0 : user.verified) === true) {
            return res.status(200).json({
                success: true,
                msg: "This Email is already verified",
            });
        }
        if (user) {
            const verifiyCode = crypto.randomInt(10000, 99999).toString();
            // Update the user's reset token in the database
            (0, userService_1.updateUserVerificationCode)(email, verifiyCode);
            (0, nodemailer_1.default)({
                from: process.env.EMAIL_USER || config_1.default.emailUser,
                to: email,
                subject: "Email Verification",
                html: `
                <div style="max-width: 400px; margin: 0 auto; font-family: Arial, sans-serif;">
    <h1>Hello ${user.username},</h1>
    <p>Thank you for signing up. Please use the verification code below to verify your email:</p>
    <div style="background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 5px; padding: 10px; text-align: center; font-family: 'Courier New', monospace; font-size: 14px;">
        <strong style="font-size: 16px;margin-bottom:20px;">Verification Code:</strong>
        <br>
        <span id="verificationCode" style="background-color: #fff; border: 1px solid #ccc; font-size: 18px; padding: 5px 10px; user-select: text;">
            ${verifiyCode}
        </span>
    </div>
    <p>Please enter this code on the website to complete the verification process.</p>
    <p>If you have any questions, feel free to reply to this email or contact us at support@yourwebsite.com.</p>
    <p>Best,<br>Your Name</p>
</div>

            
                `,
            });
            return res.status(200).json({
                success: true,
                msg: "Please check your inbox for verify your email.",
            });
        }
        else {
            return res
                .status(400)
                .json({ success: false, msg: "This email doesn't exist" });
        }
    }
    catch (error) {
        return res.status(400).json({ success: false, msg: error });
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
// verify email
const verifyEmail = async (req, res) => {
    try {
        const username = req.cookies["userName"] || req.headers["user"];
        const userId = req.cookies["userId"] || req.headers["id"];
        const { verifyCode } = req.body;
        if (!verifyCode) {
            return res.status(400).json({
                success: false,
                msg: "Verification code not provided",
            });
        }
        // Find user by verification code
        const user = await (0, userService_1.findUserByVerificationCode)(parseInt(userId), verifyCode);
        if (user && !user.verified) {
            // Update user's verification status
            await (0, userService_1.updateUserVerificationStatus)(user.user_id);
            return res.status(200).json({
                success: true,
                msg: "Email verified successfully",
            });
        }
        else {
            return res.status(400).json({
                success: false,
                msg: "Invalid or expired verification code",
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};
exports.verifyEmail = verifyEmail;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res
                .status(400)
                .json({ success: false, msg: "Email not provided" });
        }
        // Find user by email
        const user = await (0, userService_1.findUserByEmail)(email);
        if (user) {
            const tokenExpirationTime = Date.now() + 300000; // 3 minutes from now
            const resetToken = crypto.randomInt(10000, 99999).toString();
            (0, userService_1.updateUserResetToken)(email, resetToken, tokenExpirationTime.toString());
            (0, nodemailer_1.default)({
                from: process.env.EMAIL_USER || config_1.default.emailUser,
                to: email,
                subject: "Reset Password",
                html: `<div style="max-width: 400px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h1>Hello ${user.username},</h1>
                <p>Please use the verification code below to reset your password:</p>
                <div style="background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 5px; padding: 10px; text-align: center; font-family: 'Courier New', monospace; font-size: 14px;">
                  <strong style="font-size: 16px;margin-bottom:20px;">Verification Code:</strong>
                  <br>
                  <span id="verificationCode" style="background-color: #fff; border: 1px solid #ccc; font-size: 18px; padding: 5px 10px; user-select: text;">
                    ${resetToken}
                  </span>
                </div>
                <p>This code will expire in 2 minutes. Please enter it on the website to complete the reset password process.</p>
                <p>If you have any questions, feel free to reply to this email or contact us at support@yourwebsite.com.</p>
                <p>Best,<br>Your Name</p>
              </div>`,
            });
            return res.status(200).json({
                success: true,
                msg: "Reset password instructions sent to your email",
            });
        }
        else {
            return res.status(404).json({
                success: false,
                msg: "User with provided email not found",
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};
exports.forgotPassword = forgotPassword;
const updatePassword = async (req, res) => {
    try {
        const userId = req.cookies["userId"] || req.headers["id"];
        const { password } = req.body;
        console.log(userId, password);
        if (!userId || !password) {
            return res.status(400).json({
                success: false,
                msg: "User ID or new password not provided",
            });
        }
        // Update user's password
        await (0, userService_1.updateUserPassword)(parseInt(userId), password);
        return res.status(200).json({
            success: true,
            msg: "Password updated successfully",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown error" });
        }
    }
};
exports.updatePassword = updatePassword;
// refersh token
const refreshToken = async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const refresh_token = req.body.refreshToken;
    if (!refresh_token) {
        return res.status(400).json({
            success: false,
            message: "Refresh token is missing.",
        });
    }
    const secretKey = process.env.JWT_SECRET_KEY || config_1.default.secret_jwt;
    try {
        // Verify the refresh token
        const decode = jsonwebtoken_1.default.verify(refresh_token, secretKey);
        // Get user details from the token payload
        const userId = (_b = (_a = decode === null || decode === void 0 ? void 0 : decode.payLoad) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id;
        const userName = (_d = (_c = decode === null || decode === void 0 ? void 0 : decode.payLoad) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.username;
        const role = (_f = (_e = decode === null || decode === void 0 ? void 0 : decode.payLoad) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.role;
        const account_type = (_h = (_g = decode === null || decode === void 0 ? void 0 : decode.payLoad) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.account_type;
        if (!userId || !userName) {
            return res.status(401).json({
                success: false,
                msg: "Invalid token payload",
            });
        }
        // Generate a new access token
        const access_expirationTime = Math.floor(Date.now() / 1000) + 1 * 60 * 60; // 1 hour from now
        const new_access_token = jsonwebtoken_1.default.sign({
            exp: access_expirationTime,
            payLoad: {
                user: {
                    id: userId,
                    username: userName,
                    role: role,
                    account_type: account_type,
                },
            },
        }, secretKey);
        // Set the new access token in the response header
        res.header("new_access_token", new_access_token);
        return res.status(200).json({
            success: true,
            new_access_token: new_access_token,
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            msg: "Invalid refresh token",
        });
    }
};
exports.refreshToken = refreshToken;
//add user to user libraries
const addUserToUserLibraries = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.cookies["userId"] || req.headers["id"];
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, msg: "User ID is required" });
        }
        const user = await (0, userService_1.findUserById)(parseInt(adminId));
        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: "who are you?🤔" });
        }
        if (user.role !== "patron") {
            return res.status(401).json({
                success: false,
                msg: "You have no permission 🤬😡",
            });
        }
        const result = await (0, user_WithLibrarianService_1.addUserLibrariesForPatron)(parseInt(userId));
        return res.status(200).json({ success: true, msg: result });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, msg: "Internal server error" });
    }
};
exports.addUserToUserLibraries = addUserToUserLibraries;
//# sourceMappingURL=user.controller.js.map