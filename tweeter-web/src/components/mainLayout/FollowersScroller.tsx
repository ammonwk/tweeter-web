import { AuthToken, FakeData, User } from "tweeter-shared";
import UserItemScroller from "./UserItemScroller";

const FollowersScroller = () => {
  const loadMoreFollowers = async (
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
      loadItems={loadMoreFollowers}
      itemDescription="followers"
      featurePath="/followers"
    />
  );
};

export default FollowersScroller;
