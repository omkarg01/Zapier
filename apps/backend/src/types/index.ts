import { z } from "zod";

export const SignupSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
    name : z.string().min(3) 
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const ZapCreateSchema = z.object({
    trigger : z.object({
        availableTriggerId: z.string(),
        metadata: z.any().optional()
    }),
    actions : z.array(z.object({
        availableActionId: z.string(),
        metadata : z.any().optional()
    }))
})