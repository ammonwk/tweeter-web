import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
    displaySuccessMessage: (message: string) => void;
    displayToast: (message: string) => string;
    deleteToast: (toastId: string | undefined) => void;
    setDisplayedUser: (user: User) => void;
    navigate: (path: string) => void;
    setIsFollower: (isFollower: boolean) => void;
    setFolloweeCount: (followeeCount: number) => void;
    setFollowerCount: (followerCount: number) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter {
    private _view: UserInfoView;
    public userService: UserService;

    public constructor(view: UserInfoView) {
        this._view = view;
        this.userService = new UserService();
    }

    protected get view() {
        return this._view;
    }

    public async setDisplayedUser(user: User) {
        this._view.setDisplayedUser(user);
    }

    public async setIsFollowerStatus(
        currentUser: User,
        displayedUser: User,
        authToken: AuthToken
        ) {
        try {
            if (currentUser === displayedUser) {
            this._view.setIsFollower(false);
            } else {
            this._view.setIsFollower(
                await this.userService.getIsFollowerStatus(authToken, currentUser!, displayedUser!)
            );
            }
        } catch (error) {
            this._view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`
        );
        }
    };

    public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this._view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
            this._view.displayErrorMessage(`Failed to get followees count because of exception: ${error}`);
        }
    }

    public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this._view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
            this._view.displayErrorMessage(`Failed to get followers count because of exception: ${error}`);
        }
    }

    public async switchToLoggedInUser (currentUser: User): Promise<void> {
        this._view.setDisplayedUser(currentUser);
        this._view.navigate(`${this.getBaseUrl()}/${currentUser.alias}`);
    }

    private getBaseUrl(): string {
        const segments = location.pathname.split("/@");
        return segments.length > 1 ? segments[0] : "/";
    }

    public async followDisplayedUser (
        authToken: AuthToken,
        displayedUser: User
    ): Promise<void> {
        var followingUserToast = "";

        try {
            this._view.setIsLoading(true);
            followingUserToast = this._view.displayToast(`Following ${displayedUser.name}...`);

            const [followerCount, followeeCount] = await this.userService.follow(
                authToken,
                displayedUser   
            );

            this._view.setIsFollower(true);
            this._view.setFollowerCount(followerCount);
            this._view.setFolloweeCount(followeeCount);
        } catch (error) {
            this._view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
        } finally {
            this._view.deleteToast(followingUserToast);
            this._view.setIsLoading(false);
        }
    };

    public async unfollowDisplayedUser (
        authToken: AuthToken,
        displayedUser: User
    ): Promise<void> {
        var unfollowingUserToast = "";

        try {
            this._view.setIsLoading(true);
            unfollowingUserToast = this._view.displayToast(`Unfollowing ${displayedUser.name}...`);

            const [followerCount, followeeCount] = await this.userService.unfollow(
                authToken,
                displayedUser
            );
            this._view.setIsFollower(false);
            this._view.setFollowerCount(followerCount);
            this._view.setFolloweeCount(followeeCount);
        } catch (error) {
            this._view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
        } finally {
            this._view.deleteToast(unfollowingUserToast);
            this._view.setIsLoading(false);
        }
    };
}
