import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import { ToastType } from "../toaster/Toast";
import StatusItem from "../statusItem/StatusItem";
import { useUserInfo } from "../userInfo/hooks";
import { useMessageActions } from "../toaster/hooks";
import { StatusPresenter } from "../../presenters/StatusPresenter";
import { FeedPresenter } from "../../presenters/FeedPresenter";
import { StatusView } from "../../presenters/StatusPresenter";

export const PAGE_SIZE = 10;

interface Props {
  presenter: new (view: StatusView) => StatusPresenter;
  itemDescription: string;
  featurePath: string;
}

const StatusItemScroller = (props: Props) => {
  const { displayToast } = useMessageActions();
  const [items, setItems] = useState<Status[]>([]);
  const { authToken, displayedUser } = useUserInfo();

  const presenterRef = useRef(
    new props.presenter({
      addItems: (newItems) => setItems((previousItems) => [...previousItems, ...newItems]),
      displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    })
  )

  useEffect(() => {
    presenterRef.current = new props.presenter({
      addItems: (newItems) => setItems((previousItems) => [...previousItems, ...newItems]),
      displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    });
  }, [props.presenter]);

  useEffect(() => {
    presenterRef.current.reset();
    presenterRef.current.loadMoreItems(authToken!, displayedUser!.alias!);
    setItems([]);
  }, [displayedUser]);

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
            <StatusItem status={item} featurePath={props.featurePath} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
