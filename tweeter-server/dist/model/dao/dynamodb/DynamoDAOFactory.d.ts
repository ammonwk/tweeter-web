import { DAOFactory } from "../DAOFactory";
import { IUserDAO } from "../IUserDAO";
import { IFollowDAO } from "../IFollowDAO";
import { IFeedDAO } from "../IFeedDAO";
import { IStoryDAO } from "../IStoryDAO";
import { IAuthTokenDAO } from "../IAuthTokenDAO";
import { IImageDAO } from "../IImageDAO";
export declare class DynamoDAOFactory implements DAOFactory {
    createUserDAO(): IUserDAO;
    createFollowDAO(): IFollowDAO;
    createFeedDAO(): IFeedDAO;
    createStoryDAO(): IStoryDAO;
    createAuthTokenDAO(): IAuthTokenDAO;
    createImageDAO(): IImageDAO;
}
