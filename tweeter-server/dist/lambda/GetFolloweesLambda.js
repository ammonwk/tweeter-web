"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const handler = async (event) => {
    const followService = new FollowService_1.FollowService();
    try {
        const [items, hasMore] = await followService.loadMoreFollowees(event.token, event.userAlias, event.pageSize, event.lastItem);
        return {
            success: true,
            message: null,
            items: items,
            hasMore: hasMore,
        };
    }
    catch (e) {
        throw new Error("[Server Error] " + (e.message ?? "Unknown error"));
    }
};
exports.handler = handler;
