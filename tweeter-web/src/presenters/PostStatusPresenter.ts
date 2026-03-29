import { AuthToken } from "tweeter-shared";
import { Status } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface PostStatusView extends View {
    displaySuccessMessage: (message: string) => void;
    clearPost: () => void;
    setIsLoading: (isLoading: boolean) => void;
    displayToast: (message: string) => string;
    deleteToast: (toastId: string | undefined) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private readonly _userService: UserService;

    public constructor(view: PostStatusView) {
        super(view);
        this._userService = new UserService();
    }

    protected get userService() {
        return this._userService;
    }

    public async postStatus(authToken: AuthToken, newStatus: Status) {
        this.view.setIsLoading(true);
        let postStatusToast = this.view.displayToast("Posting status...");
        await this.doFailureReportingOperation(async () => {
            await this.userService.postStatus(authToken, newStatus);
            this.view.displaySuccessMessage("Status posted successfully");
        }, "post status");
        this.view.deleteToast(postStatusToast);
        this.view.setIsLoading(false);
        this.view.clearPost();
    }

    public submitPost(authToken: AuthToken, newStatus: Status) {
        this.postStatus(authToken, newStatus);
    }

    public clearPost() {
        this.view.clearPost();
    }
}
