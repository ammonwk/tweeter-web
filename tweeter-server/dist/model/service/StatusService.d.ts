import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
export declare class StatusService {
    private factory;
    private authService;
    constructor(factory: DAOFactory);
    loadMoreFeedItems(token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
    loadMoreStoryItems(token: string, userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
    postStatus(token: string, newStatus: StatusDto): Promise<void>;
}
