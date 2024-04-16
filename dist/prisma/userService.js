"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUserResetToken = exports.updateUserVerificationStatus = exports.findUserByResetToken = exports.findUserByVerificationCode = exports.updateUserVerificationCode = exports.findUserById = exports.comparePasswords = exports.findUserByEmail = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function createUser(userData) {
    try {
        const newUser = await prisma.users.create({ data: userData });
        return newUser;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
        else {
            throw new Error(`Error creating user: Unknown error occurred`);
        }
    }
}
exports.createUser = createUser;
async function findUserByEmail(email) {
    try {
        const user = await prisma.users.findUnique({ where: { email } });
        return user;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error finding email passwords: ${error.message}`);
        }
        else {
            throw new Error(`Error finding email: Unknown error occurred`);
        }
    }
}
exports.findUserByEmail = findUserByEmail;
// compare password
async function comparePasswords(password, hashedPassword) {
    try {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error comparing passwords: ${error.message}`);
        }
        else {
            throw new Error(`Error comparing passwords: Unknown error occurred`);
        }
    }
}
exports.comparePasswords = comparePasswords;
async function findUserById(userId) {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                account_type: true,
                verificationCode: false,
                verificationCode_expiration: false,
                verified: true,
                avatar: true,
                reset_token: false,
                reset_token_expiration: false,
                library_name: true,
                is_active: true,
            },
        });
        return user;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        }
        else {
            throw new Error(`Error finding user by ID: Unknown error occurred`);
        }
    }
}
exports.findUserById = findUserById;
async function updateUserVerificationCode(email, verificationCode) {
    try {
        const verifiyCode_ExpirationTime = Date.now() + 300000; // 5 minutes from now
        await prisma.users.update({
            where: { email },
            data: {
                verificationCode: verificationCode,
                verificationCode_expiration: verifiyCode_ExpirationTime.toString(),
            },
        });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error updating user verification code: ${error.message}`);
        }
        else {
            throw new Error(`Error updating user verification code: Unknown error occurred`);
        }
    }
}
exports.updateUserVerificationCode = updateUserVerificationCode;
// Function to find user by verification code
async function findUserByVerificationCode(user_id, verificationCode) {
    return await prisma.users.findFirst({
        where: {
            verificationCode: verificationCode,
            user_id: user_id,
        },
    });
}
exports.findUserByVerificationCode = findUserByVerificationCode;
;
// Function to find user by verification code
async function findUserByResetToken(user_id, reset_token) {
    return await prisma.users.findFirst({
        where: {
            reset_token: reset_token,
            user_id: user_id,
        },
    });
}
exports.findUserByResetToken = findUserByResetToken;
;
// Function to update user's verification status
async function updateUserVerificationStatus(userId) {
    await prisma.users.update({
        where: {
            user_id: userId,
        },
        data: {
            verificationCode: "",
            verified: true,
            verificationCode_expiration: null,
        },
    });
}
exports.updateUserVerificationStatus = updateUserVerificationStatus;
;
async function updateUserResetToken(email, resetToken, expirationTime) {
    await prisma.users.update({
        where: {
            email: email,
        },
        data: {
            reset_token: resetToken,
            reset_token_expiration: expirationTime,
        },
    });
}
exports.updateUserResetToken = updateUserResetToken;
;
// Function to update user's password
async function updateUserPassword(userId, newPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
    await prisma.users.update({
        where: {
            user_id: userId,
        },
        data: {
            reset_token: "",
            reset_token_expiration: null,
            password: hashedPassword,
        },
    });
}
exports.updateUserPassword = updateUserPassword;
;
//# sourceMappingURL=userService.js.map