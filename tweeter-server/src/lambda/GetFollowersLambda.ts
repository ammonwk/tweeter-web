import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
  event: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  try {
    const [items, hasMore] = await followService.loadMoreFollowers(
      event.token,
      event.userAlias,
      event.pageSize,
      event.lastItem
    );
    return {
      success: true,
      message: null,
      items: items,
      hasMore: hasMore,
    };
  } catch (e) {
    throw new Error(
      "[Server Error] " + ((e as Error).message ?? "Unknown error")
    );
  }
};
