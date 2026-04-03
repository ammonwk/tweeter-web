import { UserDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
export declare class FollowService {
    private factory;
    private authService;
    constructor(factory: DAOFactory);
    loadMoreFollowers(token: string, userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
    loadMoreFollowees(token: string, userAlias: string, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
    getFollowerCount(token: string, user: UserDto): Promise<number>;
    getFolloweeCount(token: string, user: UserDto): Promise<number>;
    getIsFollowerStatus(token: string, user: UserDto, selectedUser: UserDto): Promise<boolean>;
    follow(token: string, userToFollow: UserDto): Promise<[number, number]>;
    unfollow(token: string, userToUnfollow: UserDto): Promise<[number, number]>;
}
