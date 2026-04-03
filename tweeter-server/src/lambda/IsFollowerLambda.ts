import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const followService = new FollowService(new DynamoDAOFactory());
  try {
    const isFollower = await followService.getIsFollowerStatus(
      event.token, event.user, event.selectedUser
    );
    return { success: true, message: null, isFollower };
  } catch (e) {
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
