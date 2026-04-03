import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory());
  try {
    await statusService.postStatus(event.token, event.newStatus);
    return { success: true, message: null };
  } catch (e) {
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
