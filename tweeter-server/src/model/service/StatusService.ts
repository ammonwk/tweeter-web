import { StatusDto } from "tweeter-shared";
import { DAOFactory } from "../dao/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";

export class StatusService {
  private factory: DAOFactory;
  private authService: AuthorizationService;

  constructor(factory: DAOFactory) {
    this.factory = factory;
    this.authService = new AuthorizationService(factory);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.verifyToken(token);
    const feedDAO = this.factory.createFeedDAO();
    return feedDAO.getPageOfFeedItems(
      userAlias,
      pageSize,
      lastItem?.timestamp
    );
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authService.verifyToken(token);
    const storyDAO = this.factory.createStoryDAO();
    return storyDAO.getPageOfStoryItems(
      userAlias,
      pageSize,
      lastItem?.timestamp
    );
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    const currentAlias = await this.authService.verifyToken(token);
    const storyDAO = this.factory.createStoryDAO();

    // Post to story
    await storyDAO.putStoryItem(
      currentAlias,
      newStatus.timestamp,
      newStatus.post
    );

    // Synchronously update feeds of all followers (will be async in M4B)
    const followDAO = this.factory.createFollowDAO();
    const feedDAO = this.factory.createFeedDAO();

    const followerAliases =
      await followDAO.getAllFollowerAliases(currentAlias);

    const feedItems = followerAliases.map((alias: string) => ({
      receiverAlias: alias,
      timestamp: newStatus.timestamp,
      senderAlias: currentAlias,
      post: newStatus.post,
    }));

    if (feedItems.length > 0) {
      await feedDAO.putFeedItemBatch(feedItems);
    }
  }
}
