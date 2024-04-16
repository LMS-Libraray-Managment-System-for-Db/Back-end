"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../prisma/userService");
const resetTokenVerifier = async (req, res, next) => {
    try {
        const userId = req.cookies["userId"] || req.headers["id"];
        const resetToken = req.body.token;
        const user = await (0, userService_1.findUserByResetToken)(userId, resetToken);
        if (user) {
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