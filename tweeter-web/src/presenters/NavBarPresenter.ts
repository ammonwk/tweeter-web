// For logout functionality

import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export class NavBarPresenter {
    public userService: UserService;

    public constructor() {
        this.userService = new UserService();
    }

    public async logOut(authToken: AuthToken) {
        await this.userService.logout(authToken);
    }
}
