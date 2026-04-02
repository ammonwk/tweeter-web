import MockedObject, { anything, instance, spy, verify, when, mock } from "ts-mockito";
import { UserService } from "../model/service/UserService";
import { NavBarPresenter, NavBarView } from "./NavBarPresenter";
import { AuthToken } from "tweeter-shared";

jest.mock("../model/service/UserService");

describe("NavBarPresenter", () => {
    let presenter: NavBarPresenter;
    let view: NavBarView;
    let authToken: AuthToken;
    let mockNavBarView: NavBarView;
    let mockUserService: UserService;
    let userServiceInstance: UserService;
    let navBarViewInstance: NavBarView;

    beforeEach(() => {
        mockUserService = mock(UserService);
        userServiceInstance = instance(mockUserService);

        (UserService as jest.Mock).mockImplementation(() => userServiceInstance);

        mockNavBarView = mock<NavBarView>();
        navBarViewInstance = instance(mockNavBarView);

        when(mockNavBarView.displayToast(anything())).thenReturn("toast-id");
        when(mockUserService.logout(anything())).thenResolve();

        presenter = new NavBarPresenter(navBarViewInstance);
        authToken = new AuthToken("test-token", Date.now());
    });


    it("tells view to toast when logging out", async () => {
        await presenter.logOut(authToken);
        verify(mockNavBarView.displayToast("Logging out...")).once();
    });

    it("tells view to delete toast when logging out", async () => {
        await presenter.logOut(authToken);
        verify(mockNavBarView.deleteToast("toast-id")).once();
    });

    it('calls logout on the user service right after displaying toast', async () => {
        await presenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();
    });

    it("tells the view to logOut if successful", async () => {
        await presenter.logOut(authToken);
        verify(mockNavBarView.logOut()).once();
    });

    it("navigates to the login page if successful", async () => {
        await presenter.logOut(authToken);
        verify(mockNavBarView.navigate("/login")).once();
    });

    it("deletes the toast if successful", async () => {
        await presenter.logOut(authToken);
        verify(mockNavBarView.deleteToast("toast-id")).once();
    });

    it('shows an error message if the logout fails', async () => {
        when(mockUserService.logout(authToken)).thenReject(new Error("Logout failed"));
        await presenter.logOut(authToken);
        verify(mockNavBarView.displayErrorMessage("Failed to log out because of exception: Error: Logout failed")).once();
    });

    it('does not call logout or navigate if the logout fails', async () => {
        when(mockUserService.logout(authToken)).thenReject(new Error("Logout failed"));
        await presenter.logOut(authToken);
        verify(mockNavBarView.logOut()).never();
        verify(mockNavBarView.navigate("/login")).never();
    });
    
    it('still deletes the toast if the logout fails', async () => {
        when(mockUserService.logout(authToken)).thenReject(new Error("Logout failed"));
        await presenter.logOut(authToken);
        verify(mockNavBarView.deleteToast("toast-id")).once();
    });
});