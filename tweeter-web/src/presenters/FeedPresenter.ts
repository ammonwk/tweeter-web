import { AuthToken, Status } from "tweeter-shared";
import { PagedStatusItemPresenter } from "./PagedStatusItemPresenter";
import { PagedPresenter } from "./PagedPresenter";

export class FeedPresenter extends PagedStatusItemPresenter {
    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return this.service.loadMoreFeedStatusItems(authToken, userAlias, PagedPresenter.PAGE_SIZE, this.lastItem);
    }
    protected getItemDescription(): string {
        return "load feed";
    }
}
