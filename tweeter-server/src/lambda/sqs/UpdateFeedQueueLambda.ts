import { SQSEvent } from "aws-lambda";
import { DynamoDAOFactory } from "../../model/dao/dynamodb/DynamoDAOFactory";

interface UpdateFeedMessage {
  followers: string[];
  senderAlias: string;
  post: string;
  timestamp: number;
}

export const handler = async (event: SQSEvent): Promise<void> => {
  const factory = new DynamoDAOFactory();
  const feedDAO = factory.createFeedDAO();

  for (const record of event.Records) {
    const message: UpdateFeedMessage = JSON.parse(record.body);

    const feedItems = message.followers.map((alias) => ({
      receiverAlias: alias,
      timestamp: message.timestamp,
      senderAlias: message.senderAlias,
      post: message.post,
    }));

    if (feedItems.length > 0) {
      await feedDAO.putFeedItemBatch(feedItems);
    }
  }
};
