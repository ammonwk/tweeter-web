import { StatusDto } from "tweeter-shared";
import { IFeedDAO } from "../IFeedDAO";
import { IUserDAO } from "../IUserDAO";
export declare class DynamoFeedDAO implements IFeedDAO {
    private readonly client;
    private readonly tableName;
    private readonly userDAO;
    constructor(userDAO: IUserDAO);
    putFeedItem(receiverAlias: string, timestamp: number, senderAlias: string, post: string): Promise<void>;
    putFeedItemBatch(items: {
        receiverAlias: string;
        timestamp: number;
        senderAlias: string;
        post: string;
    }[]): Promise<void>;
    getPageOfFeedItems(alias: string, pageSize: number, lastTimestamp: number | undefined): Promise<[StatusDto[], boolean]>;
}
