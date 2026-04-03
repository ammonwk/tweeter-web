"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const AuthorizationService_1 = require("./AuthorizationService");
class FollowService {
    factory;
    authService;
    constructor(factory) {
        this.factory = factory;
        this.authService = new AuthorizationService_1.AuthorizationService(factory);
    }
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        await this.authService.verifyToken(token);
        const followDAO = this.factory.createFollowDAO();
        return followDAO.getPageOfFollowers(userAlias, pageSize, lastItem?.alias);
    }
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        await this.authService.verifyToken(token);
        const followDAO = this.factory.createFollowDAO();
        return followDAO.getPageOfFollowees(userAlias, pageSize, lastItem?.alias);
    }
    async getFollowerCount(token, user) {
        await this.authService.verifyToken(token);
        const followDAO = this.factory.createFollowDAO();
        return followDAO.getFollowerCount(user.alias);
    }
    async getFolloweeCount(token, user) {
        await this.authService.verifyToken(token);
        const followDAO = this.factory.createFollowDAO();
        return followDAO.getFolloweeCount(user.alias);
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        await this.authService.verifyToken(token);
        const followDAO = this.factory.createFollowDAO();
        return followDAO.getIsFollower(user.alias, selectedUser.alias);
    }
    async follow(token, userToFollow) {
        const currentAlias = await this.authService.verifyToken(token);
        const followDAO = this.factory.createFollowDAO();
        await followDAO.putFollow(currentAlias, userToFollow.alias);
        const followerCount = await followDAO.getFollowerCount(userToFollow.alias);
        const followeeCount = await followDAO.getFolloweeCount(userToFollow.alias);
        return [followerCount, followeeCount];
    }
    async unfollow(token, userToUnfollow) {
        const currentAlias = await this.authService.verifyToken(token);
        const followDAO = this.factory.createFollowDAO();
        await followDAO.deleteFollow(currentAlias, userToUnfollow.alias);
        const followerCount = await followDAO.getFollowerCount(userToUnfollow.alias);
        const followeeCount = await followDAO.getFolloweeCount(userToUnfollow.alias);
        return [followerCount, followeeCount];
    }
}
exports.FollowService = FollowService;
