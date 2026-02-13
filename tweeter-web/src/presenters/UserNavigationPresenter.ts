import { UserService } from "../model/service/UserService";

export class UserNavigationPresenter {
    public userService: UserService;

    public constructor() {
        this.userService = new UserService();
    }
}
