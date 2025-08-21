// Import Kafka from kafkajs
import { Kafka } from "kafkajs";

// Define the Kafka topic name
import { TOPIC_NAME } from "@repo/utils";

// Create a Kafka client with clientId and brokers
const kafka = new Kafka({
  clientId: "worker-app",
  brokers: ["localhost:9092"],
});

// Define an async main function
async function main() {
  // Create a consumer with a groupId
  const consumer = kafka.consumer({ groupId: "main-worker" });

  // Connect the consumer to Kafka
  await consumer.connect();

  // Subscribe the consumer to the topic (from beginning)
  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  // Run the consumer and process each message
  await consumer.run({
    autoCommit: false, // Disable auto-commit
    eachMessage: async ({ topic, partition, message }) => {
      // Log partition, offset, and value of the message
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      // Simulate processing with a delay
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Log that processing is done
      console.log("Processing is done!");

      // Commit the offset manually after processing
      consumer.commitOffsets([
        { topic: TOPIC_NAME, partition: 0, offset: (parseInt(message.offset) + 1).toString() },
      ]);
    },
  });
}

main();
