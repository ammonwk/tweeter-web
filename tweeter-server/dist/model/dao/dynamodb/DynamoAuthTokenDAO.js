"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoAuthTokenDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoAuthTokenDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    tableName = "tweeter-authtokens";
    async putAuthToken(token, timestamp, alias) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                token,
                timestamp,
                alias,
            },
        }));
    }
    async getAuthToken(token) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { token },
        }));
        if (!result.Item)
            return null;
        return {
            alias: result.Item.alias,
            timestamp: result.Item.timestamp,
        };
    }
    async deleteAuthToken(token) {
        await this.client.send(new lib_dynamodb_1.DeleteCommand({
            TableName: this.tableName,
            Key: { token },
        }));
    }
}
exports.DynamoAuthTokenDAO = DynamoAuthTokenDAO;
