import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { ToastType } from "../../toaster/Toast";
import { useUserInfoActions } from "../../userInfo/hooks";
import { useMessageActions } from "../../toaster/hooks";
import AuthenticationFields from "../AuthenticationFields";
import { RegisterPresenter } from "../../../presenters/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); 
  const { updateUserInfo } = useUserInfoActions();
  const { displayToast } = useMessageActions();

  const presenterRef = useRef(new RegisterPresenter({
    displayErrorMessage: (message) => displayToast(ToastType.Error, message, 0),
    setImageBytes: (imageBytes) => setImageBytes(imageBytes),
    setImageFileExtension: (imageFileExtension) => setImageFileExtension(imageFileExtension),
    setIsLoading: (isLoading) => setIsLoading(isLoading),
    setImageUrl: (imageUrl) => setImageUrl(imageUrl),
    navigate: (path) => navigate(path),
    updateUserInfo: (user, displayedUser, authToken, rememberMe) => updateUserInfo(user, displayedUser, authToken, rememberMe),
  }));

  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={(event) => presenterRef.current.registerOnEnter(event, firstName, lastName, alias, password, imageBytes, imageFileExtension, rememberMe)}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={(event) => presenterRef.current.registerOnEnter(event, firstName, lastName, alias, password, imageBytes, imageFileExtension, rememberMe)}
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields
          onKeyDown={(event) => presenterRef.current.registerOnEnter(event, firstName, lastName, alias, password, imageBytes, imageFileExtension, rememberMe)}
          setAlias={setAlias}
          setPassword={setPassword}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={(event) => presenterRef.current.registerOnEnter(event, firstName, lastName, alias, password, imageBytes, imageFileExtension, rememberMe)}
            onChange={(event) => presenterRef.current.handleFileChange(event)}
          />
          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img src={imageUrl} className="img-thumbnail" alt=""></img>
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() => presenterRef.current.checkSubmitButtonStatus(firstName, lastName, alias, password, imageBytes, imageFileExtension)}
      isLoading={isLoading}
      submit={() => presenterRef.current.doRegister(firstName, lastName, alias, password, imageBytes, imageFileExtension, rememberMe)}
    />
  );
};

export default Register;
