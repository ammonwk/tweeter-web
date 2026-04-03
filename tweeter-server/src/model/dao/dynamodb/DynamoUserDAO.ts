import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared";
import { IUserDAO } from "../IUserDAO";

export class DynamoUserDAO implements IUserDAO {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly tableName = "tweeter-users";

  async putUser(
    alias: string,
    passwordHash: string,
    firstName: string,
    lastName: string,
    imageUrl: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          alias,
          passwordHash,
          firstName,
          lastName,
          imageUrl,
        },
      })
    );
  }

  async getUser(alias: string): Promise<UserDto | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
      })
    );

    if (!result.Item) return null;

    return {
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      alias: result.Item.alias,
      imageUrl: result.Item.imageUrl,
    };
  }

  async getPasswordHash(alias: string): Promise<string | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
        ProjectionExpression: "passwordHash",
      })
    );

    return result.Item?.passwordHash ?? null;
  }
}
