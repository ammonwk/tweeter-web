"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class FollowService {
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        const lastUser = lastItem ? tweeter_shared_1.User.fromDto(lastItem) : null;
        const [users, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(lastUser, pageSize, userAlias);
        return [users.map((u) => u.dto), hasMore];
    }
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        const lastUser = lastItem ? tweeter_shared_1.User.fromDto(lastItem) : null;
        const [users, hasMore] = tweeter_shared_1.FakeData.instance.getPageOfUsers(lastUser, pageSize, userAlias);
        return [users.map((u) => u.dto), hasMore];
    }
    async getFollowerCount(token, user) {
        return tweeter_shared_1.FakeData.instance.getFollowerCount(user.alias);
    }
    async getFolloweeCount(token, user) {
        return tweeter_shared_1.FakeData.instance.getFolloweeCount(user.alias);
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        return tweeter_shared_1.FakeData.instance.isFollower();
    }
    async follow(token, userToFollow) {
        const followerCount = (await tweeter_shared_1.FakeData.instance.getFollowerCount(userToFollow.alias));
        const followeeCount = (await tweeter_shared_1.FakeData.instance.getFolloweeCount(userToFollow.alias));
        return [followerCount, followeeCount];
    }
    async unfollow(token, userToUnfollow) {
        const followerCount = (await tweeter_shared_1.FakeData.instance.getFollowerCount(userToUnfollow.alias));
        const followeeCount = (await tweeter_shared_1.FakeData.instance.getFolloweeCount(userToUnfollow.alias));
        return [followerCount, followeeCount];
    }
}
exports.FollowService = FollowService;
