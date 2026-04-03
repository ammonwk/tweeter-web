import {
  AuthToken,
  FakeData,
  User,
  UserDto,
  AuthTokenDto,
} from "tweeter-shared";

export class UserService {
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("[Bad Request] Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("[Bad Request] Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    const user = FakeData.instance.findUserByAlias(alias);
    return user ? user.dto : null;
  }

  public async logout(token: string): Promise<void> {
    // Nothing to do for now
  }
}
