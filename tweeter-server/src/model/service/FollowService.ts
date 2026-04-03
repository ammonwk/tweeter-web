import { FakeData, User, UserDto } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const lastUser = lastItem ? User.fromDto(lastItem) : null;
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
      lastUser,
      pageSize,
      userAlias
    );
    return [users.map((u) => u.dto), hasMore];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const lastUser = lastItem ? User.fromDto(lastItem) : null;
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
      lastUser,
      pageSize,
      userAlias
    );
    return [users.map((u) => u.dto), hasMore];
  }

  public async getFollowerCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    return FakeData.instance.getFollowerCount(user.alias) as number;
  }

  public async getFolloweeCount(
    token: string,
    user: UserDto
  ): Promise<number> {
    return FakeData.instance.getFolloweeCount(user.alias) as number;
  }

  public async getIsFollowerStatus(
    token: string,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[number, number]> {
    const followerCount = (await FakeData.instance.getFollowerCount(
      userToFollow.alias
    )) as number;
    const followeeCount = (await FakeData.instance.getFolloweeCount(
      userToFollow.alias
    )) as number;
    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[number, number]> {
    const followerCount = (await FakeData.instance.getFollowerCount(
      userToUnfollow.alias
    )) as number;
    const followeeCount = (await FakeData.instance.getFolloweeCount(
      userToUnfollow.alias
    )) as number;
    return [followerCount, followeeCount];
  }
}
