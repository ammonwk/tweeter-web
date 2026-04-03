"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoFeedDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoFeedDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    tableName = "tweeter-feed";
    userDAO;
    constructor(userDAO) {
        this.userDAO = userDAO;
    }
    async putFeedItem(receiverAlias, timestamp, senderAlias, post) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                receiver_alias: receiverAlias,
                timestamp,
                sender_alias: senderAlias,
                post,
            },
        }));
    }
    async putFeedItemBatch(items) {
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
                    const result = await this.client.send(new lib_dynamodb_1.BatchWriteCommand({
                        RequestItems: {
                            [this.tableName]: writeRequests,
                        },
                    }));
                    const unprocessed = result.UnprocessedItems?.[this.tableName];
                    if (unprocessed && unprocessed.length > 0) {
                        writeRequests = unprocessed;
                        await new Promise((r) => setTimeout(r, 200 * Math.pow(2, retries)));
                        retries++;
                    }
                    else {
                        break;
                    }
                }
                catch (e) {
                    if (e.name === "ProvisionedThroughputExceededException" &&
                        retries < 4) {
                        await new Promise((r) => setTimeout(r, 500 * Math.pow(2, retries)));
                        retries++;
                    }
                    else {
                        throw e;
                    }
                }
            }
        }
    }
    async getPageOfFeedItems(alias, pageSize, lastTimestamp) {
        const params = {
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
exports.DynamoFeedDAO = DynamoFeedDAO;
