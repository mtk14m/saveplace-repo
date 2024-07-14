"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
//app.use(cookieParser());
//les routes de mon api 
app.use("/api/auth/", auth_route_1.default);
//app.get("/", ()=>{console.log("tottototot")})
app.listen(8000, () => {
    console.log("Server is running!");
});
//# sourceMappingURL=app.js.map