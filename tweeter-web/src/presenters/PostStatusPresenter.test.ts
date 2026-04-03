import MockedObject, { anything, instance, spy, verify, when, mock } from "ts-mockito";
import { UserService } from "../model/service/UserService";
import { PostStatusPresenter, PostStatusView } from "./PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";

jest.mock("../model/service/UserService");

describe("PostStatusPresenter", () => {
    let presenter: PostStatusPresenter;
    let view: PostStatusView;
    let authToken: AuthToken;
    let mockPostStatusView: PostStatusView;
    let mockUserService: UserService;
    let userServiceInstance: UserService;
    let PostStatusViewInstance: PostStatusView;
    let user: User;
    let status: Status;

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        mockUserService = mock(UserService);
        PostStatusViewInstance = instance(mockPostStatusView);
        userServiceInstance = instance(mockUserService);
        (UserService as jest.Mock).mockImplementation(() => userServiceInstance);

        when(mockPostStatusView.displayToast(anything())).thenReturn("toast-id");

        presenter = new PostStatusPresenter(PostStatusViewInstance);
        authToken = new AuthToken("test-token", Date.now());

        user = new User("test user", "test email", "test password", "test image");
        status = new Status("test status", user, Date.now());
    });


    it("tells view to toast when posting status", async () => {
        await presenter.postStatus(authToken, status);
        verify(mockPostStatusView.displayToast("Posting status...")).once();
    });

    it("tells view to delete toast when logging out", async () => {
        await presenter.postStatus(authToken, status);
        verify(mockPostStatusView.deleteToast("toast-id")).once();
    });

    it("tells the view to display success message if successful", async () => {
        await presenter.postStatus(authToken, status);
        verify(mockPostStatusView.displaySuccessMessage("Status posted successfully")).once();
    });


    it("deletes the toast if successful", async () => {
        await presenter.postStatus(authToken, status);
        verify(mockPostStatusView.deleteToast("toast-id")).once();
    });

    it('shows an error message if the post status fails', async () => {
        when(mockUserService.postStatus(authToken, status)).thenReject(new Error("Post status failed"));
        await presenter.postStatus(authToken, status);
        verify(mockPostStatusView.displayErrorMessage("Failed to post status because of exception: Error: Post status failed")).once();
    });
    
    it('still deletes the toast if the post status fails', async () => {
        when(mockUserService.postStatus(authToken, status)).thenReject(new Error("Post status failed"));
        await presenter.postStatus(authToken, status);
        verify(mockPostStatusView.deleteToast("toast-id")).once();
    });
});