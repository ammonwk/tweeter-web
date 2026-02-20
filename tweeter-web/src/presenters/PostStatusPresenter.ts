import { AuthToken } from "tweeter-shared";
import { Status } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface PostStatusView {
    displayErrorMessage: (message: string) => void;
    displaySuccessMessage: (message: string) => void;
    clearPost: () => void;
    setIsLoading: (isLoading: boolean) => void;
    displayToast: (message: string) => string;
    deleteToast: (toastId: string | undefined) => void;
}

export class PostStatusPresenter {
    private _view: PostStatusView;
    private _userService: UserService;
    
    public constructor(view: PostStatusView) {
        this._view = view;
        this._userService = new UserService();
    }

    protected get view() {
        return this._view;
    }

    public async postStatus(authToken: AuthToken, newStatus: Status) {
        const toastId = this._view.displayToast("Posting status...");
        try {
            this._view.setIsLoading(true);
            await this._userService.postStatus(authToken, newStatus);
            this._view.displaySuccessMessage("Status posted successfully");
            this._view.clearPost();
        } catch (error) {
            this._view.displayErrorMessage(`Failed to post status because of exception: ${error}`);
        } finally {
            this._view.setIsLoading(false);
            this._view.deleteToast(toastId!);
        }
    }

    public submitPost(authToken: AuthToken, newStatus: Status) {
        this.postStatus(authToken, newStatus);
    }

    public clearPost() {
        this._view.clearPost();
    }
}
