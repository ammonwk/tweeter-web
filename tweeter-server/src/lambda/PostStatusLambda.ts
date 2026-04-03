import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory());
  try {
    console.log("PostStatus: starting...");
    await statusService.postStatus(event.token, event.newStatus);
    console.log("PostStatus: success");
    return { success: true, message: null };
  } catch (e) {
    console.error("PostStatus error:", (e as Error).message);
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
