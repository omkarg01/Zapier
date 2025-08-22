import { Router } from "express";
import { authMiddleware } from "../authMiddleware";
import { ZapCreateSchema } from "../types";
import { z } from 'zod';
import { prisma } from "@repo/prisma";

const router = Router();

// create zap 
router.post('/', authMiddleware, async (req, res)  => {
    try {
        // @ts-ignore
        const userId = req.id;
        const body = req.body;

        const parsebody = ZapCreateSchema.parse(body);

        const createdZap = await prisma.$transaction(async (tx) => {
            const zap = await tx.zap.create({
                data :{
                    userId: userId,
                    trigger : {
                        create : {
                            availableTriggerId : parsebody.trigger.availableTriggerId,
                            metadata : parsebody.trigger.metadata
                        }
                    },
                    actions: {
                        create : parsebody.actions.map((x, index) => ({
                            availableActionId: x.availableActionId,
                            sortingOrder: index,
                            metadata: x.metadata
                        }))
                    }
                },
                // Include the trigger and actions in the response
                include: {
                    trigger: true,
                    actions: true,
                },
            })
            return zap;
        })


        return res.status(200).json({message : "Zap Created Successfuly!", zap: createdZap})


    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({ error: error.issues });
        }
        return res.status(500).json({message: (error as Error).message})
    }
})

// get all zaps
router.get('/', authMiddleware, async (req, res) => {
    try {
         // @ts-ignore
        const userId = req.id;

        const zaps = await prisma.zap.findMany({
            where : {
                userId: userId,
            },
            include: {
                trigger :true,
                actions :true
            }
        })

        if (!zaps) return res.status(200).json({message: "No Zaps Found!"})

        return res.status(200).json({zap : zaps})

    } catch (error) {
        return res.status(500).json({message: (error as Error).message})
    }
})

// get zap by its id
router.get('/:zapId', authMiddleware, async (req, res) => {
     try {
         // @ts-ignore
        const userId = req.id;
        const zapId = req.params.zapId

        const zap = await prisma.zap.findFirst({
            where : {
                userId: userId,
                id: zapId
            },
            include: {
                trigger :true,
                actions :true
            }
        })

        if (!zap) return res.status(200).json({message: "No Zaps Found!"})

        return res.status(200).json({zap : zap})

    } catch (error) {
        return res.status(500).json({message: (error as Error).message})
    }
})

export const zapRouter = router;