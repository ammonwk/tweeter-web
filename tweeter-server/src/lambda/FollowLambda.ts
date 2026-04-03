import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: FollowRequest
): Promise<FollowResponse> => {
  const followService = new FollowService(new DynamoDAOFactory());
  try {
    const [followerCount, followeeCount] = await followService.follow(
      event.token, event.user
    );
    return { success: true, message: null, followerCount, followeeCount };
  } catch (e) {
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
