import { PostStatusPresenter, PostStatusView } from "../../presenters/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import PostStatus from "./PostStatus";
import { render, screen } from "@testing-library/react";
import { anything, instance, mock, verify, when } from "ts-mockito";
import userEvent from "@testing-library/user-event";

const mockUser = new User("test user", "test email", "test password", "test image");
const mockAuthToken = new AuthToken("test-token", Date.now());
const mockStatus = new Status("test status", mockUser, Date.now());


jest.mock("../userInfo/hooks", () => ({
    useUserInfo: () => ({
        currentUser: mockUser,
        displayedUser: mockUser,
        authToken: mockAuthToken,
    }),
}));

jest.mock("../toaster/hooks", () => ({
    useMessageActions: () => ({
        displayToast: jest.fn(),
        deleteToast: jest.fn(),
    }),
}));

describe("PostStatus", () => {

    let mockPresenter: PostStatusPresenter;
    let mockPresenterInstance: PostStatusPresenter;

    const renderPostStatus = () => {
        render(<PostStatus presenter={MockPresenterConstructor as any} />);
    }

    beforeEach(() => {
        mockPresenter = mock(PostStatusPresenter);
        mockPresenterInstance = instance(mockPresenter);
    });

    function MockPresenterConstructor(this:any, view: PostStatusView) {
        return mockPresenterInstance;
    }

    it("post status and clear buttons are disabled when post is empty", () => {
        renderPostStatus();
        expect(screen.getByRole("button", { name: "Post Status" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
    });

    it("both buttons enabled when post is not empty", async () => {
        renderPostStatus();
        await userEvent.type(screen.getByPlaceholderText("What's on your mind?"), "test");
        expect(screen.getByRole("button", { name: "Post Status" })).toBeEnabled();
        expect(screen.getByRole("button", { name: "Clear" })).toBeEnabled();
    });

    it("butto disables again if you clear the post", async () => {
        renderPostStatus();
        await userEvent.type(screen.getByPlaceholderText("What's on your mind?"), "test");
        await userEvent.clear(screen.getByPlaceholderText("What's on your mind?"));
        expect(screen.getByRole("button", { name: "Post Status" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
    });

    it("calls submitPost when you click the post button", async () => {
        renderPostStatus();
        await userEvent.type(screen.getByPlaceholderText("What's on your mind?"), "test status");
        await userEvent.click(screen.getByRole("button", { name: "Post Status" }));
        verify(mockPresenter.submitPost(mockAuthToken, anything())).once();
    });

    it("calls clearPost when you click the clear button", async () => {
        renderPostStatus();
        await userEvent.type(screen.getByPlaceholderText("What's on your mind?"), "test");
        await userEvent.click(screen.getByRole("button", { name: "Clear" }));
        verify(mockPresenter.clearPost()).once();
    });

});