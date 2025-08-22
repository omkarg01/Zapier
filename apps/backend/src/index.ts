import express from "express";
import dotenv from 'dotenv'
import { userRouter } from "./router/userRouter";
import { zapRouter } from "./router/zapRouter";

dotenv.config()
const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter)
app.use("/api/v1/zap", zapRouter)


app.listen(3000)

