import { PagedPresenter } from "./PagedPresenter";
import { User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


export abstract class PagedUserItemPresenter extends PagedPresenter<User, FollowService> {
    createService(): FollowService {
        return new FollowService();
    }
}