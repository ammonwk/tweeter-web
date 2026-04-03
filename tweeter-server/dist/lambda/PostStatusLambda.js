"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const StatusService_1 = require("../model/service/StatusService");
const DynamoDAOFactory_1 = require("../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    const statusService = new StatusService_1.StatusService(new DynamoDAOFactory_1.DynamoDAOFactory());
    try {
        await statusService.postStatus(event.token, event.newStatus);
        return { success: true, message: null };
    }
    catch (e) {
        throw new Error(e.message ?? "[Server Error] Unknown error");
    }
};
exports.handler = handler;
