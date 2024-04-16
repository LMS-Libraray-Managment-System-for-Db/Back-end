"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
// import { connectToDatabase } from './database/connectDb';
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
// import { defaultLimiter } from "./middleware/reqLimiter";
const hpp_1 = __importDefault(require("hpp"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const reqLimiter_1 = require("./middleware/reqLimiter");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
dotenv_1.default.config({ path: "./../config.env" });
const hostName = process.env.HOST_NAME || "0.0.0.0";
const port = Number(process.env.PORT) || 5000;
// connectToDatabase();
app.set("trust proxy", 0);
// middleware
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "50kb" }));
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//The extended: true option allows for parsing complex objects and arrays.
//----------*******sanatize data********------------
//----------*****************************------------
// middleware to protect against HTTP Parameter Pollution attacks  put after parsing process
//It prevents multiple values for the same parameter,
app.use((0, hpp_1.default)());
app.use("/api/v1/user", reqLimiter_1.defaultLimiter, userRouter_1.default);
// app.use("/api/v1/module", defaultLimiter, moduleRouter);
// app.use("/api/v1/project", defaultLimiter, projectRouter);
//-------------------------------------------------------
if (hostName && port) {
    server.listen(port, hostName, () => {
        console.log(`server is running at http://${hostName}:${port}`);
    });
}
//# sourceMappingURL=server.js.map