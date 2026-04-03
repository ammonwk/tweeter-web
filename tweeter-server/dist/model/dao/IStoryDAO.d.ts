import { StatusDto } from "tweeter-shared";
export interface IStoryDAO {
    putStoryItem(alias: string, timestamp: number, post: string): Promise<void>;
    getPageOfStoryItems(alias: string, pageSize: number, lastTimestamp: number | undefined): Promise<[StatusDto[], boolean]>;
}
