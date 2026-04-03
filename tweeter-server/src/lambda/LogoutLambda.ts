import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
  event: LogoutRequest
): Promise<TweeterResponse> => {
  const userService = new UserService();
  try {
    await userService.logout(event.token);
    return {
      success: true,
      message: null,
    };
  } catch (e) {
    throw new Error(
      "[Server Error] " + ((e as Error).message ?? "Unknown error")
    );
  }
};
