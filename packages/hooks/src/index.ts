import express from "express";
import { PrismaClient } from "../../generated/prisma";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    await prisma.$transaction(async (tx: any) => {
        const run = await prisma.zapRun.create({
            data : {
                zapId : zapId,
                metadata : body
            } 
        })
        await prisma.zapRunOutBox.create({
            data: {
                zapRunId: run.id
            }
        })

    })

    res.json({
        message: "Webhook recieved"
    })
})



const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
