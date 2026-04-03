import { DAOFactory } from "../dao/DAOFactory";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export class AuthorizationService {
  private factory: DAOFactory;

  constructor(factory: DAOFactory) {
    this.factory = factory;
  }

  async verifyToken(token: string): Promise<string> {
    const authTokenDAO = this.factory.createAuthTokenDAO();
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
    await authTokenDAO.putAuthToken(token, now, tokenRecord.alias);

    return tokenRecord.alias;
  }
}
