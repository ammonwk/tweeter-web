import { useNavigate } from "react-router-dom";
import { ToastType } from "../toaster/Toast";
import { useUserInfo, useUserInfoActions } from "../userInfo/hooks";
import { useMessageActions } from "../toaster/hooks";
import { UserNavigationPresenter } from "../../presenters/UserNavigationPresenter";

const useUserNavigation = () => {
  const navigate = useNavigate();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayToast, deleteToast } = useMessageActions();
  const { authToken, displayedUser } = useUserInfo();

  const presenterRef = new UserNavigationPresenter({
    displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    setDisplayedUser: (user) => setDisplayedUser(user),
    navigate: (path) => navigate(path),
  });

  return { navigateToUser: (event: React.MouseEvent, featurePath: string) => presenterRef.navigateToUser(event, featurePath, authToken!, displayedUser!) };
};

export default useUserNavigation;
