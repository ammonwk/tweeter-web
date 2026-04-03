import {
  AuthenticateResponse,
  FollowRequest,
  FollowResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LogoutRequest,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  StatusDto,
  TweeterResponse,
  UnfollowRequest,
  User,
  UserDto,
  AuthToken,
  AuthTokenDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://i7b7b3p8v7.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // Authentication

  public async login(
    request: LoginRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthenticateResponse
    >(request, "/login");

    return this.handleAuthResponse(response);
  }

  public async register(
    request: RegisterRequest
  ): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthenticateResponse
    >(request, "/register");

    return this.handleAuthResponse(response);
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/logout");

    this.handleTweeterResponse(response);
  }

  // User operations

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/getuser");

    if (response.success) {
      return response.user ? User.fromDto(response.user) : null;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error getting user");
    }
  }

  // Follow operations

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    return this.handlePagedUserResponse(response, "followers");
  }

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    return this.handlePagedUserResponse(response, "followees");
  }

  public async getFollowerCount(
    request: GetFollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follower/count");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "Unknown error getting follower count"
      );
    }
  }

  public async getFolloweeCount(
    request: GetFollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/followee/count");

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "Unknown error getting followee count"
      );
    }
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follower/status");

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "Unknown error getting follower status"
      );
    }
  }

  public async follow(
    request: FollowRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error following user");
    }
  }

  public async unfollow(
    request: UnfollowRequest
  ): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      FollowResponse
    >(request, "/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown error unfollowing user");
    }
  }

  // Status operations

  public async getMoreStoryItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/story/list");

    return this.handlePagedStatusResponse(response, "story items");
  }

  public async getMoreFeedItems(
    request: PagedStatusItemRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedStatusItemRequest,
      PagedStatusItemResponse
    >(request, "/feed/list");

    return this.handlePagedStatusResponse(response, "feed items");
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/status/post");

    this.handleTweeterResponse(response);
  }

  // Helper methods

  private handleAuthResponse(
    response: AuthenticateResponse
  ): [User, AuthToken] {
    if (response.success) {
      const user = User.fromDto(response.user);
      const token = AuthToken.fromDto(response.token);

      if (user == null) {
        throw new Error("User data missing from auth response");
      }
      if (token == null) {
        throw new Error("Token data missing from auth response");
      }

      return [user, token];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown authentication error");
    }
  }

  private handlePagedUserResponse(
    response: PagedUserItemResponse,
    itemType: string
  ): [User[], boolean] {
    if (response.success) {
      const items: User[] | null = response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

      if (items == null) {
        throw new Error(`No ${itemType} found`);
      }

      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(
        response.message ?? `Unknown error getting ${itemType}`
      );
    }
  }

  private handlePagedStatusResponse(
    response: PagedStatusItemResponse,
    itemType: string
  ): [Status[], boolean] {
    if (response.success) {
      const items: Status[] | null = response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

      if (items == null) {
        throw new Error(`No ${itemType} found`);
      }

      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(
        response.message ?? `Unknown error getting ${itemType}`
      );
    }
  }

  private handleTweeterResponse(response: TweeterResponse): void {
    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? "Unknown error");
    }
  }
}
