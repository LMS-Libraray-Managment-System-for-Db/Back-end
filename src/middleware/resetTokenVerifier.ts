import express from "express";
import { findUserByEmail } from "../prisma/services/userService";

const resetTokenVerifier = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const email = req.body.email;
        const user = await findUserByEmail(email);
        const resetToken = req.body.token;

        if (user) {
            req.headers["user"] = user.username;
            req.headers["id"] = String(user.user_id);
            const tokenExpirationTime = user.reset_token_expiration;
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

export default resetTokenVerifier;
