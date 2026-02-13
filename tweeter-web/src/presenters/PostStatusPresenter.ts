import { UserService } from "../model/service/UserService";

export class PostStatusPresenter {
    public userService: UserService;

    public constructor() {
        this.userService = new UserService();
    }
}
