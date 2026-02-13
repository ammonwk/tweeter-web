import { AuthToken, Status } from "tweeter-shared";

export interface StatusView {
    addItems: (newItems: Status[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class StatusPresenter {
    private _hasMoreItems = true;
    private _lastItem: Status | null = null;

    private _view: StatusView;

    protected constructor(view: StatusView) {
        this._view = view;
    }

    protected get view() {
        return this._view;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }

    reset() {
        this.lastItem = null;
        this.hasMoreItems = true;
    }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
