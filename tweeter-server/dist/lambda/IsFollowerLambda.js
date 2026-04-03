"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../model/service/FollowService");
const handler = async (event) => {
    const followService = new FollowService_1.FollowService();
    try {
        const isFollower = await followService.getIsFollowerStatus(event.token, event.user, event.selectedUser);
        return {
            success: true,
            message: null,
            isFollower: isFollower,
        };
    }
    catch (e) {
        throw new Error("[Server Error] " + (e.message ?? "Unknown error"));
    }
};
exports.handler = handler;
