import { AuthToken, FakeData, Status } from "tweeter-shared";
import StatusItemScroller from "./StatusItemScroller";

const FeedScroller = () => {
  const loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <StatusItemScroller
      loadItems={loadMoreFeedItems}
      itemDescription="feed items"
      featurePath="/feed"
    />
  );
};

export default FeedScroller;
