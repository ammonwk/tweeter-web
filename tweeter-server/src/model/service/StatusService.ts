import { FakeData, Status, StatusDto } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const lastStatus = lastItem ? Status.fromDto(lastItem) : null;
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      lastStatus,
      pageSize
    );
    return [statuses.map((s) => s.dto), hasMore];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const lastStatus = lastItem ? Status.fromDto(lastItem) : null;
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      lastStatus,
      pageSize
    );
    return [statuses.map((s) => s.dto), hasMore];
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    // Nothing to do for now with fake data
  }
}
