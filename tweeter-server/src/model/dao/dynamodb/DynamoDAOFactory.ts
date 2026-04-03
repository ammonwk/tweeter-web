import { DAOFactory } from "../DAOFactory";
import { IUserDAO } from "../IUserDAO";
import { IFollowDAO } from "../IFollowDAO";
import { IFeedDAO } from "../IFeedDAO";
import { IStoryDAO } from "../IStoryDAO";
import { IAuthTokenDAO } from "../IAuthTokenDAO";
import { IImageDAO } from "../IImageDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoFeedDAO } from "./DynamoFeedDAO";
import { DynamoStoryDAO } from "./DynamoStoryDAO";
import { DynamoAuthTokenDAO } from "./DynamoAuthTokenDAO";
import { S3ImageDAO } from "../s3/S3ImageDAO";

export class DynamoDAOFactory implements DAOFactory {
  createUserDAO(): IUserDAO {
    return new DynamoUserDAO();
  }

  createFollowDAO(): IFollowDAO {
    return new DynamoFollowDAO();
  }

  createFeedDAO(): IFeedDAO {
    return new DynamoFeedDAO();
  }

  createStoryDAO(): IStoryDAO {
    return new DynamoStoryDAO();
  }

  createAuthTokenDAO(): IAuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  createImageDAO(): IImageDAO {
    return new S3ImageDAO();
  }
}
