import { AuthToken, Status } from "tweeter-shared";
import { PagedPresenter } from "./PagedPresenter";
import { PagedStatusItemPresenter } from "./PagedStatusItemPresenter";

export class StoryPresenter extends PagedStatusItemPresenter {
    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return this.service.loadMoreStoryStatusItems(authToken, userAlias, PagedPresenter.PAGE_SIZE, this.lastItem);
    }
    protected getItemDescription(): string {
        return "load story";
    }
}
