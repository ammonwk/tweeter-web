import { StatusDto } from "tweeter-shared";
import { IStoryDAO } from "../IStoryDAO";
import { IUserDAO } from "../IUserDAO";
export declare class DynamoStoryDAO implements IStoryDAO {
    private readonly client;
    private readonly tableName;
    private readonly userDAO;
    constructor(userDAO: IUserDAO);
    putStoryItem(alias: string, timestamp: number, post: string): Promise<void>;
    getPageOfStoryItems(alias: string, pageSize: number, lastTimestamp: number | undefined): Promise<[StatusDto[], boolean]>;
}
