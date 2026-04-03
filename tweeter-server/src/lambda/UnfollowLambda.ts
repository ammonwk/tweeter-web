import { UnfollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
  event: UnfollowRequest
): Promise<FollowResponse> => {
  const followService = new FollowService();
  try {
    const [followerCount, followeeCount] = await followService.unfollow(
      event.token,
      event.user
    );
    return {
      success: true,
      message: null,
      followerCount: followerCount,
      followeeCount: followeeCount,
    };
  } catch (e) {
    throw new Error(
      "[Server Error] " + ((e as Error).message ?? "Unknown error")
    );
  }
};
