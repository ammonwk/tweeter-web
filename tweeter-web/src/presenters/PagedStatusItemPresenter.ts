import { StatusService } from "../model/service/StatusService";
import { Status } from "tweeter-shared";
import { PagedPresenter } from "./PagedPresenter";


export abstract class PagedStatusItemPresenter extends PagedPresenter<Status, StatusService> {
    createService(): StatusService {
        return new StatusService();
    }
}