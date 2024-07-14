import express from "express"
import authRoute from "./routes/auth.route"
import testAuthRute from "./routes/test.auth.route";
const app = express();

app.use(express.json());
//app.use(cookieParser());


//les routes de mon api 
app.use("/api/auth/", authRoute);
app.use("/api/test/", testAuthRute);



//app.get("/", ()=>{console.log("tottototot")})
app.listen(8000, () => {
    console.log("Server is running!")
});