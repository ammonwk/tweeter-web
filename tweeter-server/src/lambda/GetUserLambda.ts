import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  try {
    const user = await userService.getUser(event.token, event.alias);
    return { success: true, message: null, user: user };
  } catch (e) {
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
