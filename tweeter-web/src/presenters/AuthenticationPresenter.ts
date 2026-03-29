import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";


export interface AuthenticationView extends View {
    setIsLoading: (isLoading: boolean) => void;
    navigate: (path: string) => void;
    updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
}

export abstract class AuthenticationPresenter<V extends AuthenticationView> extends Presenter<V> {
    private readonly _userService: UserService;

    public constructor(view: V) {
        super(view);
        this._userService = new UserService();
    }

    protected get userService() {
        return this._userService;
    }

    protected async authenticateOperation(
        operation: () => Promise<[User, AuthToken]>,
        rememberMe: boolean,
        navigateUrl: string | undefined,
        operationDescription: string
    ): Promise<void> {
        await this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            let [user, authToken] = await operation();
            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate(navigateUrl ?? `/feed/${user.alias}`);
        }, operationDescription);
        this.view.setIsLoading(false);
    }
}