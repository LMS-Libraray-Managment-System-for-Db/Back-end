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
    comparePasswords,
    createUser,
    deleteUserByIdOrEmailOrUsername,
    findUserByEmail,
    findUserById,
    findUserByVerificationCode,
    getUsersByFilters,
    isUserActive,
    updateUserById,
    updateUserPassword,
    updateUserResetToken,
    updateUserVerificationCode,
    updateUserVerificationStatus,
} from "../prisma/services/userService";
import { addUserLibrariesForPatron } from "../prisma/services/userًWithLibrarianService";

export const registerUser = async (
    req: express.Request,
    res: express.Response,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const { username, email, password, account_type } = req.body;
        const avatar = gravatar.url(email, { s: "300", r: "pg", d: "mm" });
        console.log(avatar);

        const verificationCode = crypto.randomInt(10000, 99999).toString();
        // Check if user already exists with the email
        const existingUser:any = await findUserByEmail(email);
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, msg: "Email already exists" });
        }else if(existingUser.username ==username){
            res.status(400)
                .json({ success: false, msg: "username already exists" });
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        // Get avatar URL

        // Register user
        const newUser = await createUser({
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
        if(typeof newUser =="string"){
            res
                .status(401)
                .json({ success: false, msg:newUser });
           
        }

        // Generate JWT tokens
        const secretKey: string | undefined =
            process.env.JWT_SECRET_KEY || config.secret_jwt;
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
        const access_expirationTime =
            Math.floor(Date.now() / 1000) + 1 * 60 * 60; // 1 hour from now
        const refresh_expirationTime =
            Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60; // 10 days from now
        const access_token = jwt.sign(
            { exp: access_expirationTime, payLoad },
            secretKey,
        );
        const refresh_token = jwt.sign(
            { exp: refresh_expirationTime, payLoad },
            secretKey,
        );

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

//login user

export const loginUser = async (
    req: express.Request,
    res: express.Response,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await findUserByEmail(email);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: "Invalid email or password" });
        }

        // Check if password is correct
        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, msg: "Invalid email or password" });
        }

        // Generate JWT tokens
        const secretKey: string | undefined =
            process.env.JWT_SECRET_KEY || config.secret_jwt;
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
        const access_expirationTime =
            Math.floor(Date.now() / 1000) + 1 * 60 * 60; // 1 hour from now
        const refresh_expirationTime =
            Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60; // 10 days from now
        const access_token = jwt.sign(
            { exp: access_expirationTime, payLoad },
            secretKey,
        );
        const refresh_token = jwt.sign(
            { exp: refresh_expirationTime, payLoad },
            secretKey,
        );

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
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, msg: error.message });
        } else {
            return res
                .status(500)
                .json({ success: false, msg: "unkown errror" });
        }
    }
};

// get user data

export const getUserProfile = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        // Extract user ID from request params
        const username = req.cookies["userName"] || req.headers["user"];
        const userId = req.cookies["userId"] || req.headers["id"];

        // Find user by ID
        const user = await findUserById(parseInt(userId));
        if (!user) {
            return res
                .status(404)
                .json({ success: false, msg: "User not found" });
        }

        // Return user profile
        return res.status(200).json({ success: true, user });
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

//send verification email
export const sendVerificationEmail = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { email } = req.body;
        const user = await findUserByEmail(email);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: "No email found" });
        }

        if (user?.verified === true) {
            return res.status(200).json({
                success: true,
                msg: "This Email is already verified",
            });
        }

        if (user) {
            const verifiyCode = crypto.randomInt(10000, 99999).toString();
            // Update the user's reset token in the database
            updateUserVerificationCode(email, verifiyCode);
            sendMail({
                from: process.env.EMAIL_USER || config.emailUser,
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
        } else {
            return res
                .status(400)
                .json({ success: false, msg: "This email doesn't exist" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, msg: error });
    }
};

// verify email
export const verifyEmail = async (
    req: express.Request,
    res: express.Response,
) => {
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
        const user = await findUserByVerificationCode(
            parseInt(userId),
            verifyCode,
        );

        if (user && !user.verified) {
            // Update user's verification status
            await updateUserVerificationStatus(user.user_id);

            return res.status(200).json({
                success: true,
                msg: "Email verified successfully",
            });
        } else {
            return res.status(400).json({
                success: false,
                msg: "Invalid or expired verification code",
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

export const forgotPassword = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res
                .status(400)
                .json({ success: false, msg: "Email not provided" });
        }

        // Find user by email
        const user = await findUserByEmail(email);

        if (user) {
            const tokenExpirationTime = Date.now() + 300000; // 3 minutes from now
            const resetToken = crypto.randomInt(10000, 99999).toString();
            updateUserResetToken(
                email,
                resetToken,
                tokenExpirationTime.toString(),
            );
            sendMail({
                from: process.env.EMAIL_USER || config.emailUser,
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
        } else {
            return res.status(404).json({
                success: false,
                msg: "User with provided email not found",
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

export const updatePassword = async (
    req: express.Request,
    res: express.Response,
) => {
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
        await updateUserPassword(parseInt(userId), password);

        return res.status(200).json({
            success: true,
            msg: "Password updated successfully",
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

// refersh token
export const refreshToken = async (
    req: express.Request,
    res: express.Response,
) => {
    const refresh_token = req.body.refreshToken;

    if (!refresh_token) {
        return res.status(400).json({
            success: false,
            message: "Refresh token is missing.",
        });
    }

    const secretKey: string | any =
        process.env.JWT_SECRET_KEY || config.secret_jwt;

    try {
        // Verify the refresh token
        const decode: any = jwt.verify(refresh_token, secretKey);

        // Get user details from the token payload
        const userId = decode?.payLoad?.user?.id;
        const userName = decode?.payLoad?.user?.username;
        const role = decode?.payLoad?.user?.role;
        const account_type = decode?.payLoad?.user?.account_type;

        if (!userId || !userName) {
            return res.status(401).json({
                success: false,
                msg: "Invalid token payload",
            });
        }

        // Generate a new access token
        const access_expirationTime =
            Math.floor(Date.now() / 1000) + 1 * 60 * 60; // 1 hour from now
        const new_access_token = jwt.sign(
            {
                exp: access_expirationTime,
                payLoad: {
                    user: {
                        id: userId,
                        username: userName,
                        role: role,
                        account_type: account_type,
                    },
                },
            },
            secretKey,
        );

        // Set the new access token in the response header
        res.header("new_access_token", new_access_token);

        return res.status(200).json({
            success: true,
            new_access_token: new_access_token,
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            msg: "Invalid refresh token",
        });
    }
};

//add user to user libraries

export const addUserToUserLibraries = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        // const { userId } = req.params;
        const user_id = req.cookies["userId"] || req.headers["id"];
        if (!user_id) {
            return res
                .status(400)
                .json({ success: false, msg: "User ID is required" });
        }
        const user = await findUserById(parseInt(user_id));
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

        const result = await addUserLibrariesForPatron(parseInt(user_id));
        return res.status(200).json({ success: true, msg: result });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, msg: "Internal server error" });
    }
};
