import { UserService } from "../model/service/UserService";

export interface View {
    displayErrorMessage: (message: string) => void;
}

export abstract class Presenter<V extends View> {
    private readonly _userService: UserService;
    private _view: V;

    public constructor(view: V) {
        this._view = view;
        this._userService = new UserService();
    }

    protected get view() {
        return this._view;
    }

    protected get userService() {
        return this._userService;
    }

    protected async doFailureReportingOperation(
        operation: () => Promise<void>,
        errorMessage: string
    ): Promise<void> {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(`Failed to ${errorMessage} because of exception: ${error}`);
        }
    }
}
