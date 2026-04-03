import { PostStatusPresenter, PostStatusView } from "../../presenters/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import PostStatus from "./PostStatus";
import { render, screen } from "@testing-library/react";
import { instance, mock, verify } from "ts-mockito";
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

    const mockSubmitPost = jest.fn();
    const mockClearPost = jest.fn();

    const MockPresenter = jest.fn().mockImplementation((view) => ({
        submitPost: mockSubmitPost,
        clearPost: mockClearPost,
    }));

    const renderPostStatus = () => {
        render(<PostStatus presenter={MockPresenter} />);
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
        await userEvent.type(screen.getByPlaceholderText("What's on your mind?"), "test");
        await userEvent.click(screen.getByRole("button", { name: "Post Status" }));
        expect(mockSubmitPost).toHaveBeenCalled();
    });

    it("calls clearPost when you click the clear button", async () => {
        renderPostStatus();
        await userEvent.type(screen.getByPlaceholderText("What's on your mind?"), "test");
        await userEvent.click(screen.getByRole("button", { name: "Clear" }));
        expect(mockClearPost).toHaveBeenCalled();
    });

});