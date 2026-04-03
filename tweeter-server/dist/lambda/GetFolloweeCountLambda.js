"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const DynamoDAOFactory_1 = require("../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    const followService = new FollowService_1.FollowService(new DynamoDAOFactory_1.DynamoDAOFactory());
    try {
        const count = await followService.getFolloweeCount(event.token, event.user);
        return { success: true, message: null, count };
    }
    catch (e) {
        throw new Error(e.message ?? "[Server Error] Unknown error");
    }
};
exports.handler = handler;
