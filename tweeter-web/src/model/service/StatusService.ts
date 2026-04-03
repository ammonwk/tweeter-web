import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedStatusItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreFeedItems({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    });
  }

  public async loadMoreStoryStatusItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.serverFacade.getMoreStoryItems({
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    });
  }
}
