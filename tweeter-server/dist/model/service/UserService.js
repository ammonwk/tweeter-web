"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const AuthorizationService_1 = require("./AuthorizationService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
class UserService {
    factory;
    authService;
    constructor(factory) {
        this.factory = factory;
        this.authService = new AuthorizationService_1.AuthorizationService(factory);
    }
    async login(alias, password) {
        const userDAO = this.factory.createUserDAO();
        const savedHash = await userDAO.getPasswordHash(alias);
        if (!savedHash) {
            throw new Error("[Bad Request] Invalid alias or password");
        }
        const isValid = await bcryptjs_1.default.compare(password, savedHash);
        if (!isValid) {
            throw new Error("[Bad Request] Invalid alias or password");
        }
        const user = await userDAO.getUser(alias);
        if (!user) {
            throw new Error("[Bad Request] Invalid alias or password");
        }
        const token = await this.generateAuthToken(alias);
        return [user, token];
    }
    async register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        const userDAO = this.factory.createUserDAO();
        // Check if user already exists
        const existingUser = await userDAO.getUser(alias);
        if (existingUser) {
            throw new Error("[Bad Request] Alias already taken");
        }
        // Upload profile image to S3
        const imageDAO = this.factory.createImageDAO();
        const imageUrl = await imageDAO.putImage(alias + imageFileExtension, userImageBytes);
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Store user
        await userDAO.putUser(alias, passwordHash, firstName, lastName, imageUrl);
        // Initialize follow counts
        const followDAO = this.factory.createFollowDAO();
        // counts are auto-initialized via if_not_exists in the DAO
        const user = { firstName, lastName, alias, imageUrl };
        const token = await this.generateAuthToken(alias);
        return [user, token];
    }
    async getUser(token, alias) {
        await this.authService.verifyToken(token);
        const userDAO = this.factory.createUserDAO();
        return userDAO.getUser(alias);
    }
    async logout(token) {
        const authTokenDAO = this.factory.createAuthTokenDAO();
        await authTokenDAO.deleteAuthToken(token);
    }
    async generateAuthToken(alias) {
        const token = (0, uuid_1.v4)();
        const timestamp = Date.now();
        const authTokenDAO = this.factory.createAuthTokenDAO();
        await authTokenDAO.putAuthToken(token, timestamp, alias);
        return { token, timestamp };
    }
}
exports.UserService = UserService;
