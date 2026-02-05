import { useContext } from "react";
import { UserInfoContext, UserInfoActionsContext } from "./UserInfoContexts";

export const useUserInfo = () => useContext(UserInfoContext);
export const useUserInfoActions = () => useContext(UserInfoActionsContext);
