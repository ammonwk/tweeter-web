"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoStoryDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoStoryDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    tableName = "tweeter-story";
    userDAO;
    constructor(userDAO) {
        this.userDAO = userDAO;
    }
    async putStoryItem(alias, timestamp, post) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                sender_alias: alias,
                timestamp,
                post,
            },
        }));
    }
    async getPageOfStoryItems(alias, pageSize, lastTimestamp) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: "sender_alias = :alias",
            ExpressionAttributeValues: {
                ":alias": alias,
            },
            Limit: pageSize,
            ScanIndexForward: false,
        };
        if (lastTimestamp !== undefined) {
            params.ExclusiveStartKey = {
                sender_alias: alias,
                timestamp: lastTimestamp,
            };
        }
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
        const items = result.Items ?? [];
        const statuses = [];
        for (const item of items) {
            const user = await this.userDAO.getUser(item.sender_alias);
            if (user) {
                statuses.push({
                    post: item.post,
                    user,
                    timestamp: item.timestamp,
                });
            }
        }
        const hasMore = !!result.LastEvaluatedKey;
        return [statuses, hasMore];
    }
}
exports.DynamoStoryDAO = DynamoStoryDAO;
