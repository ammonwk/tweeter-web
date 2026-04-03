"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../model/service/UserService");
const handler = async (event) => {
    const userService = new UserService_1.UserService();
    try {
        const user = await userService.getUser(event.token, event.alias);
        return {
            success: true,
            message: null,
            user: user,
        };
    }
    catch (e) {
        throw new Error("[Server Error] " + (e.message ?? "Unknown error"));
    }
};
exports.handler = handler;
