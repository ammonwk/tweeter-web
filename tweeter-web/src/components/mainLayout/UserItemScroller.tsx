import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import { ToastType } from "../toaster/Toast";
import UserItem from "../userItem/UserItem";
import { useUserInfo, useUserInfoActions } from "../userInfo/hooks";
import { useMessageActions } from "../toaster/hooks";
import { UserItemPresenter, UserItemView } from "../../presenters/UserItemPresenter";

export const PAGE_SIZE = 10;

interface Props {
  presenter: new (view: UserItemView) => UserItemPresenter;
  itemDescription: string;
  featurePath: string;
}

const UserItemScroller = (props: Props) => {
  const { displayToast } = useMessageActions();
  const [items, setItems] = useState<User[]>([]);

  const presenterRef = useRef(
    new props.presenter({
      addItems: (newItems) => setItems((previousItems) => [...previousItems, ...newItems]),
      displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    })
  )

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    presenterRef.current.loadMoreItems(authToken!, displayedUser!.alias!);
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenterRef.current.reset();
  };


  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => presenterRef.current.loadMoreItems(authToken!, displayedUser!.alias!)}
        hasMore={presenterRef.current.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <UserItem user={item} featurePath={props.featurePath} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
