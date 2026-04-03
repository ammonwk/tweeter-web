import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
  event: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
  const followService = new FollowService();
  try {
    const count = await followService.getFollowerCount(
      event.token,
      event.user
    );
    return {
      success: true,
      message: null,
      count: count,
    };
  } catch (e) {
    throw new Error(
      "[Server Error] " + ((e as Error).message ?? "Unknown error")
    );
  }
};
