import "./AppNavbar.css";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { AuthToken } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";
import { useUserInfo, useUserInfoActions } from "../userInfo/hooks";
import { useMessageActions } from "../toaster/hooks";
import { NavBarPresenter } from "../../presenters/NavBarPresenter";
import { NavBarView } from "../../presenters/NavBarPresenter";
import { useRef } from "react";
interface Props {
  presenter: new (view: NavBarView) => NavBarPresenter;
}

const AppNavbar = (props: Props) => {
  const { displayToast, deleteToast } = useMessageActions();
  const { clearUserInfo } = useUserInfoActions();
  const navigate = useNavigate();
  const presenterRef = useRef(new props.presenter({
    logOut: () => clearUserInfo(),
    displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    displayToast: (message) => displayToast(ToastType.Info, message, 0),
    deleteToast: (toastId) => deleteToast(toastId!), 
    navigate: (path) => navigate(path),
  }));

  const location = useLocation();
  const { authToken, displayedUser } = useUserInfo();

  return (
    <Navbar
      collapseOnSelect
      className="mb-4"
      expand="md"
      bg="primary"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-flex flex-row">
            <div className="p-2">
              <NavLink className="brand-link" to="/">
                <Image src={"/bird-white-32.png"} alt="" />
              </NavLink>
            </div>
            <div id="brand-title" className="p-3">
              <NavLink className="brand-link" to="/">
                <b>Tweeter</b>
              </NavLink>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink
                to={`/feed/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/feed/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Feed
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/story/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/story/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Story
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/followees/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/followees/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Followees
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/followers/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/followers/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Followers
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <button
                id="logout"
                onClick={() => presenterRef.current.logOut(authToken!)}
              >
                Logout  
              </button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
