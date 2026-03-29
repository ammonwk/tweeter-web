import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";


export interface UserInfoView extends View {
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

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private readonly _userService: UserService;

    public constructor(view: UserInfoView) {
        super(view);
        this._userService = new UserService();
    }

    protected get userService() {
        return this._userService;
    }

    public async setDisplayedUser(user: User) {
        this.view.setDisplayedUser(user);
    }

    public async setIsFollowerStatus(
        currentUser: User,
        displayedUser: User,
        authToken: AuthToken
        ) {
        await this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(await this.userService.getIsFollowerStatus(authToken, currentUser!, displayedUser!));
            }
        }, "determine follower status");
    };

    public async setNumbFollowees (
        authToken: AuthToken,
        displayedUser: User
    ) {
        await this.doFailureReportingOperation(async () => {
            this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
        }, "get followees count");
    }

    public async setNumbFollowers (
        authToken: AuthToken,
        displayedUser: User
    ) {
        await this.doFailureReportingOperation(async () => {
            this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
        }, "get followers count");
    }

    public async switchToLoggedInUser (currentUser: User): Promise<void> {
        this.view.setDisplayedUser(currentUser);
        this.view.navigate(`${this.getBaseUrl()}/${currentUser.alias}`);
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
        await this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            followingUserToast = this.view.displayToast(`Following ${displayedUser.name}...`);

            const [followerCount, followeeCount] = await this.userService.follow(
                authToken,
                displayedUser   
            );

            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        }, "follow user");
        this.view.deleteToast(followingUserToast);
        this.view.setIsLoading(false);
    };

    public async unfollowDisplayedUser (
        authToken: AuthToken,
        displayedUser: User
    ): Promise<void> {
        var unfollowingUserToast = "";

        await this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            unfollowingUserToast = this.view.displayToast(`Unfollowing ${displayedUser.name}...`);

            const [followerCount, followeeCount] = await this.userService.unfollow(
                authToken,
                displayedUser
            );
            this.view.setIsFollower(false);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        }, "unfollow user");
        this.view.deleteToast(unfollowingUserToast);
        this.view.setIsLoading(false);
    };
}
