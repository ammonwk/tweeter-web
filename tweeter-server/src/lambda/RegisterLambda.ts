import { RegisterRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "../model/dao/dynamodb/DynamoDAOFactory";

export const handler = async (
  event: RegisterRequest
): Promise<AuthenticateResponse> => {
  const userService = new UserService(new DynamoDAOFactory());
  try {
    const [user, token] = await userService.register(
      event.firstName,
      event.lastName,
      event.alias,
      event.password,
      event.userImageBytes,
      event.imageFileExtension
    );
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
