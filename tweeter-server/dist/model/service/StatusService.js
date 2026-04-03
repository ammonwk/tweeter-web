"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const AuthorizationService_1 = require("./AuthorizationService");
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
        // Post to story
        await storyDAO.putStoryItem(currentAlias, newStatus.timestamp, newStatus.post);
        // Synchronously update feeds of all followers (will be async in M4B)
        const followDAO = this.factory.createFollowDAO();
        const feedDAO = this.factory.createFeedDAO();
        const followerAliases = await followDAO.getAllFollowerAliases(currentAlias);
        const feedItems = followerAliases.map((alias) => ({
            receiverAlias: alias,
            timestamp: newStatus.timestamp,
            senderAlias: currentAlias,
            post: newStatus.post,
        }));
        if (feedItems.length > 0) {
            await feedDAO.putFeedItemBatch(feedItems);
        }
    }
}
exports.StatusService = StatusService;
