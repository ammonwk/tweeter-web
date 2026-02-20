import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";
import { useUserInfo, useUserInfoActions } from "./hooks";
import { useMessageActions } from "../toaster/hooks";
import { UserInfoPresenter, UserInfoView } from "../../presenters/UserInfoPresenter";

interface UserInfoProps {
  presenter: new (view: UserInfoView) => UserInfoPresenter;
}

const UserInfo = (props: UserInfoProps) => {
  const { displayToast, deleteToast } = useMessageActions();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const { currentUser, authToken, displayedUser } = useUserInfo();
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const presenterRef = useRef(new props.presenter({
    displayErrorMessage: (message: string) => displayToast(ToastType.Error, message, 0),
    displaySuccessMessage: (message: string) => displayToast(ToastType.Info, message, 2000),
    displayToast: (message: string) => displayToast(ToastType.Info, message, 0),
    deleteToast: (toastId: string | undefined) => deleteToast(toastId!),
    setDisplayedUser: (user: User) => setDisplayedUser(user),
    navigate: (path: string) => navigate(path),
    setIsFollower: (isFollower: boolean) => setIsFollower(isFollower),
    setFolloweeCount: (followeeCount: number) => setFolloweeCount(followeeCount),
    setFollowerCount: (followerCount: number) => setFollowerCount(followerCount),
    setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),
    displayedUser: displayedUser!,
    authToken: authToken!,
  }));

  useEffect(() => {
    presenterRef.current.setDisplayedUser(displayedUser!);
    presenterRef.current.setIsFollowerStatus(currentUser!);
    presenterRef.current.setNumbFollowees(authToken!, displayedUser!);
    presenterRef.current.setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={(event) => {event.preventDefault(); presenterRef.current.switchToLoggedInUser(currentUser)}}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => {event.preventDefault(); presenterRef.current.unfollowDisplayedUser()}}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={(event) => {event.preventDefault(); presenterRef.current.followDisplayedUser()}}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
