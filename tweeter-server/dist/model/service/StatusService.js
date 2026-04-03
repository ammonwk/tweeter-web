"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const AuthorizationService_1 = require("./AuthorizationService");
const POST_STATUS_QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/590184031929/tweeter-post-status-queue";
class StatusService {
    factory;
    authService;
    constructor(factory) {
        this.factory = factory;
        this.authService = new AuthorizationService_1.AuthorizationService(factory);
    }
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        await this.authService.verifyToken(token);
        const feedDAO = this.factory.createFeedDAO();
        return feedDAO.getPageOfFeedItems(userAlias, pageSize, lastItem?.timestamp);
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        await this.authService.verifyToken(token);
        const storyDAO = this.factory.createStoryDAO();
        return storyDAO.getPageOfStoryItems(userAlias, pageSize, lastItem?.timestamp);
    }
    async postStatus(token, newStatus) {
        const currentAlias = await this.authService.verifyToken(token);
        const storyDAO = this.factory.createStoryDAO();
        // Post to story synchronously
        await storyDAO.putStoryItem(currentAlias, newStatus.timestamp, newStatus.post);
        // Send to SQS for async feed distribution
        const sqsClient = new client_sqs_1.SQSClient();
        await sqsClient.send(new client_sqs_1.SendMessageCommand({
            QueueUrl: POST_STATUS_QUEUE_URL,
            MessageBody: JSON.stringify({
                senderAlias: currentAlias,
                post: newStatus.post,
                timestamp: newStatus.timestamp,
            }),
        }));
    }
}
exports.StatusService = StatusService;
