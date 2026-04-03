import { UserDto } from "tweeter-shared";
export interface IFollowDAO {
    putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
    deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
    getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
    getPageOfFollowers(followeeAlias: string, pageSize: number, lastFollowerAlias: string | undefined): Promise<[UserDto[], boolean]>;
    getPageOfFollowees(followerAlias: string, pageSize: number, lastFolloweeAlias: string | undefined): Promise<[UserDto[], boolean]>;
    getFollowerCount(alias: string): Promise<number>;
    getFolloweeCount(alias: string): Promise<number>;
    getAllFollowerAliases(followeeAlias: string): Promise<string[]>;
}
