"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const DynamoDAOFactory_1 = require("../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    const followService = new FollowService_1.FollowService(new DynamoDAOFactory_1.DynamoDAOFactory());
    try {
        const [items, hasMore] = await followService.loadMoreFollowers(event.token, event.userAlias, event.pageSize, event.lastItem);
        return { success: true, message: null, items, hasMore };
    }
    catch (e) {
        throw new Error(e.message ?? "[Server Error] Unknown error");
    }
};
exports.handler = handler;
