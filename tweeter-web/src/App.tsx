import "./App.css";
import { useUserInfo } from "./components/userInfo/hooks";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  const loadMoreFollowees = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> => {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  };

  const loadMoreFollowers = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> => {
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  };

  const loadMoreFeedItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  const loadMoreStoryItems = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={<StatusItemScroller loadItems={loadMoreFeedItems} itemDescription="feed items" key="feed items" featurePath="feed" />} />
        <Route path="story/:displayedUser" element={<StatusItemScroller loadItems={loadMoreStoryItems} itemDescription="story items" key="story items" featurePath="story" />} />
        <Route path="followees/:displayedUser" element={<UserItemScroller loadItems={loadMoreFollowees} itemDescription="followees" key="followees" featurePath="followees" />} />
        <Route path="followers/:displayedUser" element={<UserItemScroller loadItems={loadMoreFollowers} itemDescription="followers" key="followers" featurePath="followers" />} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
