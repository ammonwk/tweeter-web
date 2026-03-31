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

    public constructor(view: PostStatusView) {
        super(view);
    }

    public async postStatus(authToken: AuthToken, newStatus: Status) {
        this.view.setIsLoading(true);
        let postStatusToast = this.view.displayToast("Posting status...");
        await this.doFailureReportingOperation(async () => {
            await this.userService.postStatus(authToken, newStatus);
            this.view.displaySuccessMessage("Status posted successfully");
            this.view.clearPost();
        }, "post status");
        this.view.deleteToast(postStatusToast);
        this.view.setIsLoading(false);
    }

    public submitPost(authToken: AuthToken, newStatus: Status) {
        this.postStatus(authToken, newStatus);
    }

    public clearPost() {
        this.view.clearPost();
    }
}
