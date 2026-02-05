import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "./UserItemScroller";

const FolloweesScroller = () => {
  const loadMoreFollowees = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  };

  return (
    <UserItemScroller
      loadItems={loadMoreFollowees}
      itemDescription="followees"
      featurePath="/followees"
    />
  );
};

export default FolloweesScroller;
