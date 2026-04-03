import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StatusDto } from "tweeter-shared";
import { IStoryDAO } from "../IStoryDAO";

export class DynamoStoryDAO implements IStoryDAO {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly tableName = "tweeter-story";

  async putStoryItem(
    alias: string,
    timestamp: number,
    post: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          sender_alias: alias,
          timestamp,
          post,
        },
      })
    );
  }

  async getPageOfStoryItems(
    alias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<[StatusDto[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: "sender_alias = :alias",
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Limit: pageSize,
      ScanIndexForward: false, // newest first
    };

    if (lastTimestamp !== undefined) {
      params.ExclusiveStartKey = {
        sender_alias: alias,
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
