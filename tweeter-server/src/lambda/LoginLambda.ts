import { LoginRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
  event: LoginRequest
): Promise<AuthenticateResponse> => {
  const userService = new UserService();
  try {
    const [user, token] = await userService.login(event.alias, event.password);
    return {
      success: true,
      message: null,
      user: user,
      token: token,
    };
  } catch (e) {
    throw new Error(
      "[Bad Request] " + ((e as Error).message ?? "Unknown error")
    );
  }
};
