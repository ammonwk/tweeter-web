import { StatusDto } from "tweeter-shared";
export declare class StatusService {
    loadMoreFeedItems(token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
    loadMoreStoryItems(token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
    postStatus(token: string, newStatus: StatusDto): Promise<void>;
}
