import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared";
import { IFollowDAO } from "../IFollowDAO";

export class DynamoFollowDAO implements IFollowDAO {
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
  private readonly tableName = "tweeter-follows";
  private readonly indexName = "follows-index";
  private readonly countsTable = "tweeter-follow-counts";

  async putFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );

    // Increment counts
    await Promise.all([
      this.incrementCount(followerAlias, "followee_count"),
      this.incrementCount(followeeAlias, "follower_count"),
    ]);
  }

  async deleteFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );

    // Decrement counts
    await Promise.all([
      this.decrementCount(followerAlias, "followee_count"),
      this.decrementCount(followeeAlias, "follower_count"),
    ]);
  }

  async getIsFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          follower_handle: followerAlias,
          followee_handle: followeeAlias,
        },
      })
    );
    return !!result.Item;
  }

  async getPageOfFollowers(
    followeeAlias: string,
    pageSize: number,
    lastFollowerAlias: string | undefined
  ): Promise<[UserDto[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "followee_handle = :followee",
      ExpressionAttributeValues: {
        ":followee": followeeAlias,
      },
      Limit: pageSize,
    };

    if (lastFollowerAlias) {
      params.ExclusiveStartKey = {
        followee_handle: followeeAlias,
        follower_handle: lastFollowerAlias,
      };
    }

    const result = await this.client.send(new QueryCommand(params));
    const aliases =
      result.Items?.map((item) => item.follower_handle as string) ?? [];

    // Look up user details
    const users = await this.getUsersByAliases(aliases);
    const hasMore = !!result.LastEvaluatedKey;

    return [users, hasMore];
  }

  async getPageOfFollowees(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | undefined
  ): Promise<[UserDto[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: "follower_handle = :follower",
      ExpressionAttributeValues: {
        ":follower": followerAlias,
      },
      Limit: pageSize,
    };

    if (lastFolloweeAlias) {
      params.ExclusiveStartKey = {
        follower_handle: followerAlias,
        followee_handle: lastFolloweeAlias,
      };
    }

    const result = await this.client.send(new QueryCommand(params));
    const aliases =
      result.Items?.map((item) => item.followee_handle as string) ?? [];

    const users = await this.getUsersByAliases(aliases);
    const hasMore = !!result.LastEvaluatedKey;

    return [users, hasMore];
  }

  async getFollowerCount(alias: string): Promise<number> {
    return this.getCount(alias, "follower_count");
  }

  async getFolloweeCount(alias: string): Promise<number> {
    return this.getCount(alias, "followee_count");
  }

  // Get all follower aliases for a user (used by feed distribution)
  async getAllFollowerAliases(followeeAlias: string): Promise<string[]> {
    const aliases: string[] = [];
    let lastKey: any = undefined;

    do {
      const params: any = {
        TableName: this.tableName,
        IndexName: this.indexName,
        KeyConditionExpression: "followee_handle = :followee",
        ExpressionAttributeValues: {
          ":followee": followeeAlias,
        },
        ProjectionExpression: "follower_handle",
      };

      if (lastKey) {
        params.ExclusiveStartKey = lastKey;
      }

      const result = await this.client.send(new QueryCommand(params));
      result.Items?.forEach((item) =>
        aliases.push(item.follower_handle as string)
      );
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    return aliases;
  }

  private async getUsersByAliases(aliases: string[]): Promise<UserDto[]> {
    const userDAO = new (
      await import("./DynamoUserDAO")
    ).DynamoUserDAO();
    const users: UserDto[] = [];
    for (const alias of aliases) {
      const user = await userDAO.getUser(alias);
      if (user) users.push(user);
    }
    return users;
  }

  private async getCount(alias: string, field: string): Promise<number> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.countsTable,
        Key: { alias },
      })
    );
    return (result.Item?.[field] as number) ?? 0;
  }

  private async incrementCount(
    alias: string,
    field: string
  ): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.countsTable,
        Key: { alias },
        UpdateExpression: `SET ${field} = if_not_exists(${field}, :zero) + :one`,
        ExpressionAttributeValues: {
          ":zero": 0,
          ":one": 1,
        },
      })
    );
  }

  private async decrementCount(
    alias: string,
    field: string
  ): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.countsTable,
        Key: { alias },
        UpdateExpression: `SET ${field} = if_not_exists(${field}, :zero) - :one`,
        ExpressionAttributeValues: {
          ":zero": 0,
          ":one": 1,
        },
      })
    );
  }
}
