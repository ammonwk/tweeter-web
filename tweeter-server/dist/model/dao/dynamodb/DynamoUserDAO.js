"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoUserDAO = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoUserDAO {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient());
    tableName = "tweeter-users";
    async putUser(alias, passwordHash, firstName, lastName, imageUrl) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                alias,
                passwordHash,
                firstName,
                lastName,
                imageUrl,
            },
        }));
    }
    async getUser(alias) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { alias },
        }));
        if (!result.Item)
            return null;
        return {
            firstName: result.Item.firstName,
            lastName: result.Item.lastName,
            alias: result.Item.alias,
            imageUrl: result.Item.imageUrl,
        };
    }
    async getPasswordHash(alias) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { alias },
            ProjectionExpression: "passwordHash",
        }));
        return result.Item?.passwordHash ?? null;
    }
}
exports.DynamoUserDAO = DynamoUserDAO;
