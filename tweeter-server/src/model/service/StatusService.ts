import { StatusDto } from "tweeter-shared";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DAOFactory } from "../dao/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";

const POST_STATUS_QUEUE_URL =
  "https://sqs.us-east-1.amazonaws.com/590184031929/tweeter-post-status-queue";

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

    // Post to story synchronously
    await storyDAO.putStoryItem(
      currentAlias,
      newStatus.timestamp,
      newStatus.post
    );

    // Send to SQS for async feed distribution
    const sqsClient = new SQSClient();
    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: POST_STATUS_QUEUE_URL,
        MessageBody: JSON.stringify({
          senderAlias: currentAlias,
          post: newStatus.post,
          timestamp: newStatus.timestamp,
        }),
      })
    );
  }
}
