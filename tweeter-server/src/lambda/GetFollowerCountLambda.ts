import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
  const followService = new FollowService(new DynamoDAOFactory());
  try {
    const count = await followService.getFollowerCount(event.token, event.user);
    return { success: true, message: null, count };
  } catch (e) {
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
