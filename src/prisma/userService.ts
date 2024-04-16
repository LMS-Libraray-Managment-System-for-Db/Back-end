import { PrismaClient } from "@prisma/client";
import { User } from "../interface/models.interface";
import bcrypt from "bcryptjs";
import * as crypto from "crypto";
const prisma = new PrismaClient();

export async function createUser(userData: User) {
    try {
        const newUser = await prisma.users.create({ data: userData });
        return newUser;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error creating user: ${error.message}`);
        } else {
            throw new Error(`Error creating user: Unknown error occurred`);
        }
    }
}

export async function findUserByEmail(email: string) {
    try {
        const user = await prisma.users.findUnique({ where: { email } });
        return user;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error finding email passwords: ${error.message}`);
        } else {
            throw new Error(`Error finding email: Unknown error occurred`);
        }
    }
}

// compare password
export async function comparePasswords(
    password: string,
    hashedPassword: string,
) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error comparing passwords: ${error.message}`);
        } else {
            throw new Error(
                `Error comparing passwords: Unknown error occurred`,
            );
        }
    }
}

export async function findUserById(userId: number) {
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
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error finding user by ID: ${error.message}`);
        } else {
            throw new Error(`Error finding user by ID: Unknown error occurred`);
        }
    }
}

export async function updateUserVerificationCode(
    email: string,
    verificationCode: string,
) {
    try {
        const verifiyCode_ExpirationTime = Date.now() + 300000; // 5 minutes from now
       
        await prisma.users.update({
            where: { email },
            data: {
                verificationCode :verificationCode,
                verificationCode_expiration:verifiyCode_ExpirationTime.toString(), 
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(
                `Error updating user verification code: ${error.message}`,
            );
        } else {
            throw new Error(
                `Error updating user verification code: Unknown error occurred`,
            );
        }
    }
}

// Function to find user by verification code
export async function findUserByVerificationCode  (user_id: number,verificationCode: string) {
    return await prisma.users.findFirst({
        where: {
            verificationCode: verificationCode,
            user_id: user_id,
        },
    });
};
// Function to find user by verification code
export async function findUserByResetToken  (user_id: number,reset_token: string) {
    return await prisma.users.findFirst({
        where: {
            reset_token: reset_token,
            user_id: user_id,
        },
    });
};

// Function to update user's verification status
export async function updateUserVerificationStatus  (userId: number) {
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
};
export async function updateUserResetToken  (email: string, resetToken: string, expirationTime: string){
    await prisma.users.update({
        where: {
            email: email,
        },
        data: {
            reset_token: resetToken,
            reset_token_expiration: expirationTime,
        },
    });
};

// Function to update user's password
export async function updateUserPassword (userId: number, newPassword: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

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
};
