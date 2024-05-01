"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../prisma/services/userService");
const resetTokenVerifier = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await (0, userService_1.findUserByEmail)(email);
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
exports.default = resetTokenVerifier;
//# sourceMappingURL=resetTokenVerifier.js.map