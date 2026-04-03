import { RegisterRequest, AuthenticateResponse } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (
  event: RegisterRequest
): Promise<AuthenticateResponse> => {
  const userService = new UserService();
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
    throw new Error(
      "[Bad Request] " + ((e as Error).message ?? "Unknown error")
    );
  }
};
