import { UserDto, AuthTokenDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export class UserService {
  private factory: DAOFactory;
  private authService: AuthorizationService;

  constructor(factory: DAOFactory) {
    this.factory = factory;
    this.authService = new AuthorizationService(factory);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userDAO = this.factory.createUserDAO();

    const savedHash = await userDAO.getPasswordHash(alias);
    if (!savedHash) {
      throw new Error("[Bad Request] Invalid alias or password");
    }

    const isValid = await bcrypt.compare(password, savedHash);
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

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const userDAO = this.factory.createUserDAO();

    // Check if user already exists
    const existingUser = await userDAO.getUser(alias);
    if (existingUser) {
      throw new Error("[Bad Request] Alias already taken");
    }

    // Upload profile image to S3
    const imageDAO = this.factory.createImageDAO();
    const imageUrl = await imageDAO.putImage(
      alias + imageFileExtension,
      userImageBytes
    );

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Store user
    await userDAO.putUser(alias, passwordHash, firstName, lastName, imageUrl);

    // Initialize follow counts
    const followDAO = this.factory.createFollowDAO();
    // counts are auto-initialized via if_not_exists in the DAO

    const user: UserDto = { firstName, lastName, alias, imageUrl };
    const token = await this.generateAuthToken(alias);

    return [user, token];
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    await this.authService.verifyToken(token);
    const userDAO = this.factory.createUserDAO();
    return userDAO.getUser(alias);
  }

  public async logout(token: string): Promise<void> {
    const authTokenDAO = this.factory.createAuthTokenDAO();
    await authTokenDAO.deleteAuthToken(token);
  }

  private async generateAuthToken(alias: string): Promise<AuthTokenDto> {
    const token = uuid();
    const timestamp = Date.now();
    const authTokenDAO = this.factory.createAuthTokenDAO();
    await authTokenDAO.putAuthToken(token, timestamp, alias);
    return { token, timestamp };
  }
}
