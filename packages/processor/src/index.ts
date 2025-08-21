// Import database client from Prisma
import { prisma } from "@repo/prisma";
// Import Kafka client from kafkajs
import { Kafka } from "kafkajs";
// Import the Kafka topic name
import { TOPIC_NAME } from "@repo/utils";

// Create a Kafka instance with clientId and broker configuration
const kafka = new Kafka({
  clientId: "outbox-app",
  brokers: ["localhost:9092"],
});

// Define the main async function
async function main() {
  //   - Create a Kafka producer
  const producer = kafka.producer();
  //   - Connect the producer
  await producer.connect();

  //   - Start an infinite loop
  while (true) {
    //       - Fetch up to 10 rows from zapRunOutbox table
    const result = await prisma.zapRunOutBox.findMany({
      take: 10,
    });

    //       - Log the fetched rows for debugging
    console.log("result", result);

    //       - Send the rows as messages to the Kafka topic
    await producer.send({
      topic: TOPIC_NAME,
      messages: result.map((row) => ({
        value: row.zapRunId,
      })),
    });
    console.log("Messages pushed to Kafka successfully!");
    //         (each message contains zapRunId and stage)

    //       - Delete the processed rows from zapRunOutbox table
    // Delete only the processed rows
    await prisma.zapRunOutBox.deleteMany({
      where: {
        id: { in: result.map((row) => row.id) },
      },
    });

    //       - Wait for 3 seconds before the next iteration
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

// Call the main function
main();
