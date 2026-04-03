"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../model/service/StatusService");
const DynamoDAOFactory_1 = require("../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    const statusService = new StatusService_1.StatusService(new DynamoDAOFactory_1.DynamoDAOFactory());
    try {
        console.log("PostStatus: starting...");
        await statusService.postStatus(event.token, event.newStatus);
        console.log("PostStatus: success");
        return { success: true, message: null };
    }
    catch (e) {
        console.error("PostStatus error:", e.message);
        throw new Error(e.message ?? "[Server Error] Unknown error");
    }
};
exports.handler = handler;
