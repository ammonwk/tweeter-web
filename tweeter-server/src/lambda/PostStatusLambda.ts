import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (
  event: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  try {
    await statusService.postStatus(event.token, event.newStatus);
    return {
      success: true,
      message: null,
    };
  } catch (e) {
    throw new Error(
      "[Server Error] " + ((e as Error).message ?? "Unknown error")
    );
  }
};
