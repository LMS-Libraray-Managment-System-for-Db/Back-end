"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtTokenVerifier_1 = __importDefault(require("../middleware/jwtTokenVerifier"));
const genere_controller_1 = require("../controller/genere.controller");
const genreRouter = express_1.default.Router();
genreRouter.post("/add", jwtTokenVerifier_1.default, genere_controller_1.addGenresController);
genreRouter.get("/all", jwtTokenVerifier_1.default, genere_controller_1.getAllGenresApi);
genreRouter.delete("/delete/:genreId", jwtTokenVerifier_1.default, genere_controller_1.deleteGenreController);
exports.default = genreRouter;
//# sourceMappingURL=genreRouter.js.map