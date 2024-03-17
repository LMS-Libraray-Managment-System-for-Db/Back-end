import express from "express";
import cors from "cors";
import dotEnv from "dotenv";
// import userRouter from "./router/userRouter";
import { connectToDatabase } from './database/connectDb';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// import { defaultLimiter } from "./middleware/reqLimiter";
import hpp from "hpp";
import http from "http";


const app: express.Application = express();
const server = http.createServer(app);
dotEnv.config({ path: "./../config.env" });
const hostName: string | any = process.env.HOST_NAME || "0.0.0.0";
const port: number = Number(process.env.PORT) || 5000;
connectToDatabase();
app.set("trust proxy", 0);
// middleware
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);

app.use(express.json({ limit: "50kb" }));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
//The extended: true option allows for parsing complex objects and arrays.

//----------*******sanatize data********------------




//----------*****************************------------
// middleware to protect against HTTP Parameter Pollution attacks  put after parsing process
//It prevents multiple values for the same parameter,
app.use(hpp());


// app.use("/api/v1/user", defaultLimiter, userRouter);
// app.use("/api/v1/module", defaultLimiter, moduleRouter);
// app.use("/api/v1/project", defaultLimiter, projectRouter);


//-------------------------------------------------------

if (hostName && port) {
    server.listen(port, hostName, () => {
        console.log(`server is running at http://${hostName}:${port}`);
    });
}
