"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const DynamoDAOFactory_1 = require("../../model/dao/dynamodb/DynamoDAOFactory");
const FEED_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/590184031929/tweeter-update-feed-queue";
const BATCH_SIZE = 250;
const handler = async (event) => {
    const sqsClient = new client_sqs_1.SQSClient();
    const factory = new DynamoDAOFactory_1.DynamoDAOFactory();
    const followDAO = factory.createFollowDAO();
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        // Get all follower aliases
        const followerAliases = await followDAO.getAllFollowerAliases(message.senderAlias);
        // Send batches to the feed update queue
        for (let i = 0; i < followerAliases.length; i += BATCH_SIZE) {
            const batch = followerAliases.slice(i, i + BATCH_SIZE);
            await sqsClient.send(new client_sqs_1.SendMessageCommand({
                QueueUrl: FEED_QUEUE_URL,
                MessageBody: JSON.stringify({
                    followers: batch,
                    senderAlias: message.senderAlias,
                    post: message.post,
                    timestamp: message.timestamp,
                }),
            }));
        }
    }
};
exports.handler = handler;
