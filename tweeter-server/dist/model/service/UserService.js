"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
class UserService {
    async login(alias, password) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("[Bad Request] Invalid alias or password");
        }
        return [user.dto, tweeter_shared_1.FakeData.instance.authToken.dto];
    }
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        const user = tweeter_shared_1.FakeData.instance.firstUser;
        if (user === null) {
            throw new Error("[Bad Request] Invalid registration");
        }
        return [user.dto, tweeter_shared_1.FakeData.instance.authToken.dto];
    }
    async getUser(token, alias) {
        const user = tweeter_shared_1.FakeData.instance.findUserByAlias(alias);
        return user ? user.dto : null;
    }
    async logout(token) {
        // Nothing to do for now
    }
}
exports.UserService = UserService;
