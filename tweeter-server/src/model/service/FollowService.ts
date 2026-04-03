import { UserDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService {
  private factory: DAOFactory;
  private authService: AuthorizationService;

  constructor(factory: DAOFactory) {
    this.factory = factory;
    this.authService = new AuthorizationService(factory);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.verifyToken(token);
    const followDAO = this.factory.createFollowDAO();
    return followDAO.getPageOfFollowers(
      userAlias,
      pageSize,
      lastItem?.alias
    );
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authService.verifyToken(token);
    const followDAO = this.factory.createFollowDAO();
    return followDAO.getPageOfFollowees(
      userAlias,
      pageSize,
      lastItem?.alias
    );
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    await this.authService.verifyToken(token);
    const followDAO = this.factory.createFollowDAO();
    return followDAO.getFollowerCount(user.alias);
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    await this.authService.verifyToken(token);
    const followDAO = this.factory.createFollowDAO();
    return followDAO.getFolloweeCount(user.alias);
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.authService.verifyToken(token);
    const followDAO = this.factory.createFollowDAO();
    return followDAO.getIsFollower(user.alias, selectedUser.alias);
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[number, number]> {
    const currentAlias = await this.authService.verifyToken(token);
    const followDAO = this.factory.createFollowDAO();
    await followDAO.putFollow(currentAlias, userToFollow.alias);

    const followerCount = await followDAO.getFollowerCount(
      userToFollow.alias
    );
    const followeeCount = await followDAO.getFolloweeCount(
      userToFollow.alias
    );
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[number, number]> {
    const currentAlias = await this.authService.verifyToken(token);
    const followDAO = this.factory.createFollowDAO();
    await followDAO.deleteFollow(currentAlias, userToUnfollow.alias);

    const followerCount = await followDAO.getFollowerCount(
      userToUnfollow.alias
    );
    const followeeCount = await followDAO.getFolloweeCount(
      userToUnfollow.alias
    );
    return [followerCount, followeeCount];
  }
}
