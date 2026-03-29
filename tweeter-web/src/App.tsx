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
import ItemScroller from "./components/mainLayout/ItemScroller";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import StatusItem from "./components/statusItem/StatusItem";
import { Status, User } from "tweeter-shared";
import UserItem from "./components/userItem/UserItem";
import { StatusService } from "./model/service/StatusService";
import { FollowService } from "./model/service/FollowService";

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

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={<ItemScroller<Status, StatusService> presenterGenerator={(view) => new FeedPresenter(view)} itemComponentGenerator={(item, index) => <StatusItem status={item} featurePath="feed" />} key="feed items" featurePath="feed" />} />
        <Route path="story/:displayedUser" element={<ItemScroller<Status, StatusService> presenterGenerator={(view) => new StoryPresenter(view)} itemComponentGenerator={(item, index) => <StatusItem status={item} featurePath="story" />} key="story items" featurePath="story" />} />
        <Route path="followees/:displayedUser" element={<ItemScroller<User, FollowService> presenterGenerator={(view) => new FolloweePresenter(view)} itemComponentGenerator={(item, index) => <UserItem user={item} featurePath="followees" />} key="followees" featurePath="followees" />} />
        <Route path="followers/:displayedUser" element={<ItemScroller<User, FollowService> presenterGenerator={(view) => new FollowerPresenter(view)} itemComponentGenerator={(item, index) => <UserItem user={item} featurePath="followers" />} key="followers" featurePath="followers" />} />
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
