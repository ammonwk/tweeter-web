"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../model/service/StatusService");
const handler = async (event) => {
    const statusService = new StatusService_1.StatusService();
    try {
        const [items, hasMore] = await statusService.loadMoreStoryItems(event.token, event.userAlias, event.pageSize, event.lastItem);
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
