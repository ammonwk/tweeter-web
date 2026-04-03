import { SQSEvent } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";

const FEED_QUEUE_URL =
  "https://sqs.us-east-1.amazonaws.com/590184031929/tweeter-update-feed-queue";
const BATCH_SIZE = 250;

interface PostStatusMessage {
  senderAlias: string;
  post: string;
  timestamp: number;
}

export const handler = async (event: SQSEvent): Promise<void> => {
  const sqsClient = new SQSClient();
  const factory = new DynamoDAOFactory();
  const followDAO = factory.createFollowDAO();

  for (const record of event.Records) {
    const message: PostStatusMessage = JSON.parse(record.body);

    // Get all follower aliases
    const followerAliases = await followDAO.getAllFollowerAliases(
      message.senderAlias
    );

    // Send batches to the feed update queue
    for (let i = 0; i < followerAliases.length; i += BATCH_SIZE) {
      const batch = followerAliases.slice(i, i + BATCH_SIZE);
      await sqsClient.send(
        new SendMessageCommand({
          QueueUrl: FEED_QUEUE_URL,
          MessageBody: JSON.stringify({
            followers: batch,
            senderAlias: message.senderAlias,
            post: message.post,
            timestamp: message.timestamp,
          }),
        })
      );
    }
  }
};
