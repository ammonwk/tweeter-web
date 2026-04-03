import { LoginRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: LoginRequest
): Promise<AuthenticateResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  try {
    const [user, token] = await userService.login(event.alias, event.password);
    return {
      success: true,
      message: null,
      user: user,
      token: token,
    };
  } catch (e) {
    throw new Error((e as Error).message ?? "[Server Error] Unknown error");
  }
};
