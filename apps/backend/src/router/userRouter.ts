import { Router } from "express";
import { SigninSchema, SignupSchema } from "../types";
import { json, z } from "zod"
import { prisma } from "@repo/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { authMiddleware } from "../authMiddleware";


const router = Router()

router.post("/signup", async (req, res) => {
    try {
        const body = req.body;
        const parseBody = SignupSchema.parse(body);

        const userExist = await prisma.user.findFirst({
            where: {
                email: parseBody.username
            }
        })

        if (userExist) {
            return res.status(409).json({
                message : "User with this email already exists."
            })
        }

        const hashPassword = bcrypt.hashSync(parseBody.password, 10);

        const user = await prisma.user.create({
            data : {
                name: parseBody.name,
                email: parseBody.username,
                password: hashPassword
            }
        })

        return res.status(201).json({ message: "User created", username: user.email });

    } catch(err) {
        if (err instanceof z.ZodError) {
            return res.status(422).json({ error: err.issues });
        }

        return res.status(400).json({ 
            error: err
        })
    }
})

router.post("/signin", async (req, res) => {
    try {
        const body = req.body;
        const parseBody = SigninSchema.parse(body);

        const user = await prisma.user.findFirst({
            where : {
                email: parseBody.username
            }
        })

        if (!user) {
            return res.status(400).json({message: "User does not exist!"})
        }

        const validUser = bcrypt.compareSync(parseBody.password, user.password); 

        if (!validUser) {
            return res.status(403).json({message: "Invalid Credentials"})
        }

        const key = process.env.JWT_PRIVATE_KEY as string;

        let token = jwt.sign({ username: user.email, id: user.id }, key);

        return res.status(200).json({token})

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({ error: error.issues });
        }

        return res.status(400).json({ 
            error: error
        })
    }
})



router.get("/", authMiddleware, async (req, res) => {
    // TODO: Fix the type
    // @ts-ignore
    const id = req.id;
    const user = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true
        }
    });

    return res.json({
        user
    });
})


export const userRouter = router;