import { UserDto } from "tweeter-shared";
import { IFollowDAO } from "../IFollowDAO";
import { IUserDAO } from "../IUserDAO";
export declare class DynamoFollowDAO implements IFollowDAO {
    private readonly client;
    private readonly tableName;
    private readonly indexName;
    private readonly countsTable;
    private readonly userDAO;
    constructor(userDAO: IUserDAO);
    putFollow(followerAlias: string, followeeAlias: string): Promise<void>;
    deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
    getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
    getPageOfFollowers(followeeAlias: string, pageSize: number, lastFollowerAlias: string | undefined): Promise<[UserDto[], boolean]>;
    getPageOfFollowees(followerAlias: string, pageSize: number, lastFolloweeAlias: string | undefined): Promise<[UserDto[], boolean]>;
    getFollowerCount(alias: string): Promise<number>;
    getFolloweeCount(alias: string): Promise<number>;
    getAllFollowerAliases(followeeAlias: string): Promise<string[]>;
    private getUsersByAliases;
    private getCount;
    private incrementCount;
    private decrementCount;
}
