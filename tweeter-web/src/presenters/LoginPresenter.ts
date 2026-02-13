import { UserService } from "../model/service/UserService";

export class LoginPresenter {
    public userService: UserService;


    public constructor() {
        this.userService = new UserService();
    }

    public async doLogin(alias: string, password: string) {
        return await this.userService.login(alias, password);
    };
}
