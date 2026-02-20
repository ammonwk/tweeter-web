import { AuthToken, User } from "tweeter-shared";
import { ToastType } from "../components/toaster/Toast";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
    displayErrorMessage: (message: string) => void;
    displaySuccessMessage: (message: string) => void;
    displayToast: (message: string) => string;
    deleteToast: (toastId: string | undefined) => void;
    setDisplayedUser: (user: User) => void;
    navigate: (path: string) => void;
}

export class UserNavigationPresenter {
    private _view: UserNavigationView;
    private _userService: UserService;

    public constructor(view: UserNavigationView) {
        this._view = view;
        this._userService = new UserService();
    }

    protected get view() {
        return this._view;
    }

    public async navigateToUser(
        event: React.MouseEvent,
        featurePath: string,
        authToken: AuthToken | undefined,
        displayedUser: User
      ): Promise<void> {
        console.log("navigateToUser called")
        event.preventDefault();
    
        try {
          const alias = this.extractAlias(event.target.toString());
    
          const toUser = await this.getUser(authToken!, alias);
    
          if (toUser) {
            if (!toUser.equals(displayedUser)) {
              this._view.setDisplayedUser(toUser);
              this._view.navigate(`/${featurePath}/${toUser.alias}`);
            }
          }
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to get user because of exception: ${error}`
          );
        }
    }

    private extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    }

    private getUser(authToken: AuthToken, alias: string): Promise<User | null> {
        return this._userService.getUser(authToken, alias);
    }
}
