import { AuthToken, Status } from "tweeter-shared";

export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    displayToast: (message: string) => string;
    deleteToast: (toastId: string | undefined) => void;
}

export abstract class Presenter<V extends View> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view;
    }

    protected get view() {
        return this._view;
    }

    protected async handleError(
        operation: () => Promise<void>,
        errorMessage: string
    ): Promise<void> {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(errorMessage);
        }
    }
}
