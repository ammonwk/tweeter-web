"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../model/service/StatusService");
const handler = async (event) => {
    const statusService = new StatusService_1.StatusService();
    try {
        await statusService.postStatus(event.token, event.newStatus);
        return {
            success: true,
            message: null,
        };
    }
    catch (e) {
        throw new Error("[Server Error] " + (e.message ?? "Unknown error"));
    }
};
exports.handler = handler;
