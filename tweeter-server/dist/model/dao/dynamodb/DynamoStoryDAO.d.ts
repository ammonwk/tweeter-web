import { StatusDto } from "tweeter-shared";
import { IStoryDAO } from "../IStoryDAO";
export declare class DynamoStoryDAO implements IStoryDAO {
    private readonly client;
    private readonly tableName;
    putStoryItem(alias: string, timestamp: number, post: string): Promise<void>;
    getPageOfStoryItems(alias: string, pageSize: number, lastTimestamp: number | undefined): Promise<[StatusDto[], boolean]>;
}
