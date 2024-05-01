import express from "express";
import { findUserByEmail } from "../prisma/services/userService";

const verifyEmailVerifier = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const email = req.body.email;
        const user = await findUserByEmail(email);
        if (user) {
            const tokenExpirationTime = user.verificationCode_expiration;
            req.headers["user"] = user.username;
            req.headers["id"] = String(user.user_id);
            if (Date.now() > Number(tokenExpirationTime)) {
                return res
                    .status(400)
                    .json({ success: false, msg: "Token has expired" });
            }
            next();
        } else {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid token" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, msg: error });
    }
};

export default verifyEmailVerifier;
