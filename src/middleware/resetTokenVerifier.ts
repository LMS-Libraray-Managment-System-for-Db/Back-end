import express from "express";
import { findUserByResetToken } from "../prisma/userService";


const resetTokenVerifier = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const userId = req.cookies["userId"] || req.headers["id"];
        const resetToken  = req.body.token;
        const user = await findUserByResetToken(userId,resetToken);

        if (user) {
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
