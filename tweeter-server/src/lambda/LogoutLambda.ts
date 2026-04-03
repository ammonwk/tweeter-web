import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: LogoutRequest
): Promise<TweeterResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  try {
    await userService.logout(event.token);
    return { success: true, message: null };
  } catch (e) {
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
