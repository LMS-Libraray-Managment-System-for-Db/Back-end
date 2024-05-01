"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../prisma/services/userService");
const verifyEmailVerifier = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await (0, userService_1.findUserByEmail)(email);
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
        }
        else {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid token" });
        }
    }
    catch (error) {
        return res.status(400).json({ success: false, msg: error });
    }
};
exports.default = verifyEmailVerifier;
//# sourceMappingURL=verifyEmailVerifier.js.map