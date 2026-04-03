"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoFollowDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoFollowDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    tableName = "tweeter-follows";
    indexName = "follows-index";
    countsTable = "tweeter-follow-counts";
    async putFollow(followerAlias, followeeAlias) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        }));
        // Increment counts
        await Promise.all([
            this.incrementCount(followerAlias, "followee_count"),
            this.incrementCount(followeeAlias, "follower_count"),
        ]);
    }
    async deleteFollow(followerAlias, followeeAlias) {
        await this.client.send(new lib_dynamodb_1.DeleteCommand({
            TableName: this.tableName,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        }));
        // Decrement counts
        await Promise.all([
            this.decrementCount(followerAlias, "followee_count"),
            this.decrementCount(followeeAlias, "follower_count"),
        ]);
    }
    async getIsFollower(followerAlias, followeeAlias) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: {
                follower_handle: followerAlias,
                followee_handle: followeeAlias,
            },
        }));
        return !!result.Item;
    }
    async getPageOfFollowers(followeeAlias, pageSize, lastFollowerAlias) {
        const params = {
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
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
        const aliases = result.Items?.map((item) => item.follower_handle) ?? [];
        // Look up user details
        const users = await this.getUsersByAliases(aliases);
        const hasMore = !!result.LastEvaluatedKey;
        return [users, hasMore];
    }
    async getPageOfFollowees(followerAlias, pageSize, lastFolloweeAlias) {
        const params = {
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
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
        const aliases = result.Items?.map((item) => item.followee_handle) ?? [];
        const users = await this.getUsersByAliases(aliases);
        const hasMore = !!result.LastEvaluatedKey;
        return [users, hasMore];
    }
    async getFollowerCount(alias) {
        return this.getCount(alias, "follower_count");
    }
    async getFolloweeCount(alias) {
        return this.getCount(alias, "followee_count");
    }
    // Get all follower aliases for a user (used by feed distribution)
    async getAllFollowerAliases(followeeAlias) {
        const aliases = [];
        let lastKey = undefined;
        do {
            const params = {
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
            const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
            result.Items?.forEach((item) => aliases.push(item.follower_handle));
            lastKey = result.LastEvaluatedKey;
        } while (lastKey);
        return aliases;
    }
    async getUsersByAliases(aliases) {
        const userDAO = new (await Promise.resolve().then(() => __importStar(require("./DynamoUserDAO")))).DynamoUserDAO();
        const users = [];
        for (const alias of aliases) {
            const user = await userDAO.getUser(alias);
            if (user)
                users.push(user);
        }
        return users;
    }
    async getCount(alias, field) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: this.countsTable,
            Key: { alias },
        }));
        return result.Item?.[field] ?? 0;
    }
    async incrementCount(alias, field) {
        await this.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: this.countsTable,
            Key: { alias },
            UpdateExpression: `SET ${field} = if_not_exists(${field}, :zero) + :one`,
            ExpressionAttributeValues: {
                ":zero": 0,
                ":one": 1,
            },
        }));
    }
    async decrementCount(alias, field) {
        await this.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: this.countsTable,
            Key: { alias },
            UpdateExpression: `SET ${field} = if_not_exists(${field}, :zero) - :one`,
            ExpressionAttributeValues: {
                ":zero": 0,
                ":one": 1,
            },
        }));
    }
}
exports.DynamoFollowDAO = DynamoFollowDAO;
