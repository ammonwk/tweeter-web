import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export interface LoginView {
    displayErrorMessage: (message: string) => void;
    updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
    navigate: (path: string) => void;
    rememberMe: boolean;
    setIsLoading: (isLoading: boolean) => void;
    originalUrl: string | undefined;
}

export class LoginPresenter {
    private _view: LoginView;
    public userService: UserService;

    public constructor(view: LoginView) {
        this._view = view;
        this.userService = new UserService();
    }

    protected get view() {
        return this._view;
    }

    public async doLogin(alias: string, password: string) {
        try {
            this.view.setIsLoading(true);
            const [user, authToken] = await this.userService.login(alias, password);
            this.view.updateUserInfo(user, user, authToken, this.view.rememberMe);
            this.view.navigate(this.view.originalUrl ? this.view.originalUrl : `/feed/${user.alias}`);
            this.view.setIsLoading(false);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log in because of exception: ${error}`
      );
      this.view.setIsLoading(false);
    }
  }
}
