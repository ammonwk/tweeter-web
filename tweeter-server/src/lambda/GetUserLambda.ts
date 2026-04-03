import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
  event: GetUserRequest
): Promise<GetUserResponse> => {
  const userService = new UserService();
  try {
    const user = await userService.getUser(event.token, event.alias);
    return {
      success: true,
      message: null,
      user: user,
    };
  } catch (e) {
    throw new Error(
      "[Server Error] " + ((e as Error).message ?? "Unknown error")
    );
  }
};
