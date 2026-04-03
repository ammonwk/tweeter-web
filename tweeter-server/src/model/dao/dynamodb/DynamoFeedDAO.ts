import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusDto } from "tweeter-shared";
import { IFeedDAO } from "../IFeedDAO";
import { IUserDAO } from "../IUserDAO";

export class DynamoFeedDAO implements IFeedDAO {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly tableName = "tweeter-feed";
  private readonly userDAO: IUserDAO;

  constructor(userDAO: IUserDAO) {
    this.userDAO = userDAO;
  }

  async putFeedItem(
    receiverAlias: string,
    timestamp: number,
    senderAlias: string,
    post: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          receiver_alias: receiverAlias,
          timestamp,
          sender_alias: senderAlias,
          post,
        },
      })
    );
  }

  async putFeedItemBatch(
    items: {
      receiverAlias: string;
      timestamp: number;
      senderAlias: string;
      post: string;
    }[]
  ): Promise<void> {
    const BATCH_SIZE = 25;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      let writeRequests = batch.map((item) => ({
        PutRequest: {
          Item: {
            receiver_alias: item.receiverAlias,
            timestamp: item.timestamp,
            sender_alias: item.senderAlias,
            post: item.post,
          },
        },
      }));

      let retries = 0;
      while (writeRequests.length > 0 && retries < 5) {
        try {
          const result = await this.client.send(
            new BatchWriteCommand({
              RequestItems: {
                [this.tableName]: writeRequests,
              },
            })
          );
          const unprocessed = result.UnprocessedItems?.[this.tableName];
          if (unprocessed && unprocessed.length > 0) {
            writeRequests = unprocessed as typeof writeRequests;
            await new Promise((r) =>
              setTimeout(r, 200 * Math.pow(2, retries))
            );
            retries++;
          } else {
            break;
          }
        } catch (e: any) {
          if (
            e.name === "ProvisionedThroughputExceededException" &&
            retries < 4
          ) {
            await new Promise((r) =>
              setTimeout(r, 500 * Math.pow(2, retries))
            );
            retries++;
          } else {
            throw e;
          }
        }
      }
    }
  }

  async getPageOfFeedItems(
    alias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<[StatusDto[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: "receiver_alias = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Limit: pageSize,
      ScanIndexForward: false,
    };

    if (lastTimestamp !== undefined) {
      params.ExclusiveStartKey = {
        receiver_alias: alias,
        timestamp: lastTimestamp,
      };
    }

    const result = await this.client.send(new QueryCommand(params));
    const items = result.Items ?? [];

    const statuses: StatusDto[] = [];
    for (const item of items) {
      const user = await this.userDAO.getUser(item.sender_alias as string);
      if (user) {
        statuses.push({
          post: item.post as string,
          user,
          timestamp: item.timestamp as number,
        });
      }
    }

    const hasMore = !!result.LastEvaluatedKey;
    return [statuses, hasMore];
  }
}
