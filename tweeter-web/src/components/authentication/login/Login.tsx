import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { ToastType } from "../../toaster/Toast";
import { useUserInfoActions } from "../../userInfo/hooks";
import { useMessageActions } from "../../toaster/hooks";
import AuthenticationFields from "../AuthenticationFields";
import { LoginPresenter } from "../../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayToast } = useMessageActions();

  const presenterRef = useRef(new LoginPresenter({
    displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    updateUserInfo: (user, displayedUser, authToken, rememberMe) => updateUserInfo(user, displayedUser, authToken, rememberMe),
    navigate: (path) => navigate(path), 
    rememberMe: rememberMe,
    setIsLoading: (isLoading) => setIsLoading(isLoading),
    originalUrl: props.originalUrl,
  }));


  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenterRef.current.doLogin(alias, password);
    }
  };


  const inputFieldFactory = () => {
    return (
      <div className="mb-3">
        <AuthenticationFields
          onKeyDown={loginOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </div>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() => presenterRef.current.doLogin(alias, password)}
    />
  );
};

export default Login;
