import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";

export const handler = async (
  event: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const followService = new FollowService();
  try {
    const isFollower = await followService.getIsFollowerStatus(
      event.token,
      event.user,
      event.selectedUser
    );
    return {
      success: true,
      message: null,
      isFollower: isFollower,
    };
  } catch (e) {
    throw new Error(
      "[Server Error] " + ((e as Error).message ?? "Unknown error")
    );
  }
};
