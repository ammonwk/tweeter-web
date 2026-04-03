"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = void 0;
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
class AuthorizationService {
    factory;
    constructor(factory) {
        this.factory = factory;
    }
    async verifyToken(token) {
        const authTokenDAO = this.factory.createAuthTokenDAO();
        console.log("AuthService: getting token...");
        const tokenRecord = await authTokenDAO.getAuthToken(token);
        if (!tokenRecord) {
            throw new Error("[Bad Request] Invalid or expired auth token");
        }
        const now = Date.now();
        if (now - tokenRecord.timestamp > TOKEN_EXPIRY_MS) {
            await authTokenDAO.deleteAuthToken(token);
            throw new Error("[Bad Request] Auth token has expired");
        }
        // Refresh the token timestamp on each use
        console.log("AuthService: refreshing token...");
        await authTokenDAO.putAuthToken(token, now, tokenRecord.alias);
        console.log("AuthService: token verified for", tokenRecord.alias);
        return tokenRecord.alias;
    }
}
exports.AuthorizationService = AuthorizationService;
