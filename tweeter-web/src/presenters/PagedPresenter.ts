import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface PagedItemView<T> extends View {
    addItems: (newItems: T[]) => void;
}

export abstract class PagedPresenter<T, U> extends Presenter<PagedItemView<T>> {
    private _service: U;
    private _hasMoreItems: boolean;
    private _lastItem: T | null;
    public static readonly PAGE_SIZE = 10;
    
    abstract createService(): U;

    abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;

    abstract getItemDescription(): string;

    public async loadMoreItems(authToken: AuthToken, userAlias: string): Promise<void> {
        await this.handleError(async () => {
            const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);
            this._hasMoreItems = hasMore;
            this._lastItem = newItems[newItems.length - 1];
            this.view.addItems(newItems);
        }, this.getItemDescription());
    }

    public reset() {
        this._hasMoreItems = true;
        this._lastItem = null;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    public constructor(view: PagedItemView<T>) {
        super(view);
        this._service = this.createService();
        this._hasMoreItems = true;
        this._lastItem = null;
    }
}