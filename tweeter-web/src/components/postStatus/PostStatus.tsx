import "./PostStatus.css";
import { useEffect, useRef, useState } from "react";
import { AuthToken, Status } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";
import { useUserInfo } from "../userInfo/hooks";
import { useMessageActions } from "../toaster/hooks";
import { PostStatusPresenter, PostStatusView } from "../../presenters/PostStatusPresenter";
interface Props {
  presenter: new (view: PostStatusView) => PostStatusPresenter;
}

const PostStatus = (props: Props) => {
  const { displayToast, deleteToast } = useMessageActions();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { authToken, currentUser } = useUserInfo();

  const presenterRef = useRef(new props.presenter({
    displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    displaySuccessMessage: (message) => displayToast(ToastType.Info, message, 2000),
    clearPost: () => setPost(""),
    setIsLoading: (isLoading) => setIsLoading(isLoading),
    displayToast: (message) => displayToast(ToastType.Info, message, 0),
    deleteToast: (toastId) => deleteToast(toastId!),
  }));

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={!post.trim() || !authToken || !currentUser}
          style={{ width: "8em" }}
          onClick={() => presenterRef.current.submitPost(authToken!, new Status(post, currentUser!, Date.now()))}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Post Status"
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={!post.trim()}
          onClick={() => presenterRef.current.clearPost()}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Clear"
          )}
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
