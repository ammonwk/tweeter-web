// For logout functionality

import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface NavBarView {
    logOut: () => void;
    displayErrorMessage: (message: string) => void;
    displayToast: (message: string) => string;
    deleteToast: (toastId: string | undefined) => void;
    navigate: (path: string) => void;
}

export class NavBarPresenter {
    private _view: NavBarView;
    public userService: UserService;

    public constructor(view: NavBarView) {
        this._view = view;
        this.userService = new UserService();
    }

    protected get view() {
        return this._view;
    }

    public async logOut(authToken: AuthToken) {
        const toastId = this.view.displayToast("Logging Out...");
        try {
            await this.userService.logout(authToken);
            this.view.deleteToast(toastId!);
            this.view.logOut();
            this.view.navigate("/login");
        } catch (error) {
            this.view.deleteToast(toastId!);
            this.view.displayErrorMessage(
                `Failed to log out because of exception: ${error}`
            );
        }
    }
}
