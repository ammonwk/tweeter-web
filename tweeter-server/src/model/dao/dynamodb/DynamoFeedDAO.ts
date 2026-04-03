import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusDto } from "tweeter-shared";
import { IFeedDAO } from "../IFeedDAO";

export class DynamoFeedDAO implements IFeedDAO {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly tableName = "tweeter-feed";

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
    // DynamoDB batch write max is 25 items
    const BATCH_SIZE = 25;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      const writeRequests = batch.map((item) => ({
        PutRequest: {
          Item: {
            receiver_alias: item.receiverAlias,
            timestamp: item.timestamp,
            sender_alias: item.senderAlias,
            post: item.post,
          },
        },
      }));

      await this.client.send(
        new BatchWriteCommand({
          RequestItems: {
            [this.tableName]: writeRequests,
          },
        })
      );
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
      ScanIndexForward: false, // newest first
    };

    if (lastTimestamp !== undefined) {
      params.ExclusiveStartKey = {
        receiver_alias: alias,
        timestamp: lastTimestamp,
      };
    }

    const result = await this.client.send(new QueryCommand(params));
    const items = result.Items ?? [];

    // Look up user info for each status
    const userDAO = new (
      await import("./DynamoUserDAO")
    ).DynamoUserDAO();

    const statuses: StatusDto[] = [];
    for (const item of items) {
      const user = await userDAO.getUser(item.sender_alias as string);
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
