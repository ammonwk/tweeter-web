import { AuthToken, User } from "tweeter-shared";
import { PagedUserItemPresenter } from "./PagedUserItemPresenter";
export class FolloweePresenter extends PagedUserItemPresenter {
    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
        return this.service.loadMoreFollowees(authToken, userAlias, PagedUserItemPresenter.PAGE_SIZE, this.lastItem);
    }
    protected getItemDescription(): string {
        return "load followees";
    }
}
