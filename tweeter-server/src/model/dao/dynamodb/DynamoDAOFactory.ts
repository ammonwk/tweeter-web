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
  private userDAO: IUserDAO | null = null;

  createUserDAO(): IUserDAO {
    if (!this.userDAO) {
      this.userDAO = new DynamoUserDAO();
    }
    return this.userDAO;
  }

  createFollowDAO(): IFollowDAO {
    return new DynamoFollowDAO(this.createUserDAO());
  }

  createFeedDAO(): IFeedDAO {
    return new DynamoFeedDAO(this.createUserDAO());
  }

  createStoryDAO(): IStoryDAO {
    return new DynamoStoryDAO(this.createUserDAO());
  }

  createAuthTokenDAO(): IAuthTokenDAO {
    return new DynamoAuthTokenDAO();
  }

  createImageDAO(): IImageDAO {
    return new S3ImageDAO();
  }
}
