import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory());
  try {
    const [items, hasMore] = await statusService.loadMoreFeedItems(
      event.token, event.userAlias, event.pageSize, event.lastItem
    );
    return { success: true, message: null, items, hasMore };
  } catch (e) {
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
