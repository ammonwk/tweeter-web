// For logout functionality

import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface NavBarView extends View {
    logOut: () => void;
    displayToast: (message: string) => string;
    deleteToast: (toastId: string | undefined) => void;
    navigate: (path: string) => void;
}

export class NavBarPresenter extends Presenter<NavBarView> {
    private readonly _userService: UserService;

    public constructor(view: NavBarView) {
        super(view);
        this._userService = new UserService();
    }
    protected get userService() {
        return this._userService;
    }

    public async logOut(authToken: AuthToken): Promise<void> {
        let logoutUserToast = this.view.displayToast("Logging out...");
        await this.doFailureReportingOperation(async () => {
            await this.userService.logout(authToken);
            this.view.logOut();
            this.view.navigate("/login");
        }, "log out");
        this.view.deleteToast(logoutUserToast);
    }
}
