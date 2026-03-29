
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";


export interface LoginView extends AuthenticationView {
    rememberMe: boolean;
    originalUrl: string | undefined;
}

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
    public constructor(view: LoginView) {
        super(view);
    }

    public async doLogin(alias: string, password: string) {
        await this.authenticateOperation(async () => {
            return this.userService.login(alias, password);
        }, this.view.rememberMe, this.view.originalUrl, "log in");
  }
}
