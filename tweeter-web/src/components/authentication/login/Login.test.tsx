import { instance, mock, verify } from "ts-mockito";
import { render, screen } from "@testing-library/react";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import userEvent from "@testing-library/user-event";


jest.mock("../../../presenters/LoginPresenter");
jest.mock("../../userInfo/hooks", () => ({
    useUserInfo: () => ({
        currentUser: null,
        displayedUser: null,
        authToken: null,
    }),
    useUserInfoActions: () => ({
        updateUserInfo: jest.fn(),
        clearUserInfo: jest.fn(),
        setDisplayedUser: jest.fn(),
    }),
}));
jest.mock("../../toaster/hooks", () => ({
    useMessageActions: () => ({
        displayToast: jest.fn(),
        deleteToast: jest.fn(),
        deleteAllToasts: jest.fn(),
    }),
}));

describe("Login", () => {
    let mockPresenter: LoginPresenter;
    let mockPresenterInstance: LoginPresenter;

    const renderLogin = () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        )
    }

    beforeEach(() => {
        mockPresenter = mock(LoginPresenter);
        mockPresenterInstance = instance(mockPresenter);
        (LoginPresenter as jest.Mock).mockImplementation(() => mockPresenterInstance);
    });


    it("sign-in button starts disabled", () => {
        renderLogin();
        expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
    });

    it("sign-in button becomes enabled when alias and password are entered", async () => {
        renderLogin();
        await userEvent.type(screen.getByLabelText("Alias"), "test");
        await userEvent.type(screen.getByLabelText("Password"), "test");
        expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled();
    });

    it("button is disabled when username is empty", async () => {
        renderLogin();
        await userEvent.type(screen.getByLabelText("Password"), "test");
        expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
    });

    it("button is disabled when password is empty", async () => {
        renderLogin();
        await userEvent.type(screen.getByLabelText("Alias"), "test");
        expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled();
    });

    it("calls doLogin when button is clicked", async () => {
        renderLogin();
        await userEvent.type(screen.getByLabelText("Alias"), "test");
        await userEvent.type(screen.getByLabelText("Password"), "test");
        await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
        verify(mockPresenter.doLogin("test", "test")).once();
    });
});