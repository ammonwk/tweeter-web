"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../model/service/UserService");
const DynamoDAOFactory_1 = require("../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    const userService = new UserService_1.UserService(new DynamoDAOFactory_1.DynamoDAOFactory());
    try {
        const [user, token] = await userService.login(event.alias, event.password);
        return {
            success: true,
            message: null,
            user: user,
            token: token,
        };
    }
    catch (e) {
        throw new Error(e.message ?? "[Server Error] Unknown error");
    }
};
exports.handler = handler;
