import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (
  event: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService();
  try {
    const [items, hasMore] = await statusService.loadMoreStoryItems(
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
