import { UserService } from "../model/service/UserService";

export interface UserInfoView {

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
}
