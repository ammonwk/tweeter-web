"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const UserService_1 = require("../model/service/UserService");
const handler = async (event) => {
    const userService = new UserService_1.UserService();
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
        throw new Error("[Bad Request] " + (e.message ?? "Unknown error"));
    }
};
exports.handler = handler;
