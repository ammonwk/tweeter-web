import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "./UserInfoHook";

interface UserInfoListener {
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: User) => void;
}

const useUserInfoListener = (): UserInfoListener => {
  const { currentUser, displayedUser, authToken, updateUserInfo, clearUserInfo, setDisplayedUser } =
    useUserInfo();

  return {
    currentUser:currentUser,
    displayedUser:displayedUser,
    authToken:authToken,
    updateUserInfo:updateUserInfo,
    clearUserInfo:clearUserInfo,
    setDisplayedUser:setDisplayedUser,
  };
};

export default useUserInfoListener;
