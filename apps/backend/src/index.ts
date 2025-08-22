import express from "express";
import userRouter from "./router/userRouter";
import dotenv from 'dotenv'

dotenv.config()
const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter)
// app.use("/api/v1/zap")


app.listen(3000)

