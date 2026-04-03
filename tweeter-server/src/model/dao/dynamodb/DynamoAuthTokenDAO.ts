import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { IAuthTokenDAO } from "../IAuthTokenDAO";

export class DynamoAuthTokenDAO implements IAuthTokenDAO {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly tableName = "tweeter-authtokens";

  async putAuthToken(
    token: string,
    timestamp: number,
    alias: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          token,
          timestamp,
          alias,
        },
      })
    );
  }

  async getAuthToken(
    token: string
  ): Promise<{ alias: string; timestamp: number } | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { token },
      })
    );

    if (!result.Item) return null;

    return {
      alias: result.Item.alias as string,
      timestamp: result.Item.timestamp as number,
    };
  }

  async deleteAuthToken(token: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { token },
      })
    );
  }
}
