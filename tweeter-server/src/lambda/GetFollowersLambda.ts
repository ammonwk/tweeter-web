import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService(new DynamoDAOFactory());
  try {
    const [items, hasMore] = await followService.loadMoreFollowers(
      event.token, event.userAlias, event.pageSize, event.lastItem
    );
    return { success: true, message: null, items, hasMore };
  } catch (e) {
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
