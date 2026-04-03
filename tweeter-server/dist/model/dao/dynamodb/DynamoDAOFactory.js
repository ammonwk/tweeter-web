"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAOFactory = void 0;
const DynamoUserDAO_1 = require("./DynamoUserDAO");
const DynamoFollowDAO_1 = require("./DynamoFollowDAO");
const DynamoFeedDAO_1 = require("./DynamoFeedDAO");
const DynamoStoryDAO_1 = require("./DynamoStoryDAO");
const DynamoAuthTokenDAO_1 = require("./DynamoAuthTokenDAO");
const S3ImageDAO_1 = require("../s3/S3ImageDAO");
class DynamoDAOFactory {
    userDAO = null;
    createUserDAO() {
        if (!this.userDAO) {
            this.userDAO = new DynamoUserDAO_1.DynamoUserDAO();
        }
        return this.userDAO;
    }
    createFollowDAO() {
        return new DynamoFollowDAO_1.DynamoFollowDAO(this.createUserDAO());
    }
    createFeedDAO() {
        return new DynamoFeedDAO_1.DynamoFeedDAO(this.createUserDAO());
    }
    createStoryDAO() {
        return new DynamoStoryDAO_1.DynamoStoryDAO(this.createUserDAO());
    }
    createAuthTokenDAO() {
        return new DynamoAuthTokenDAO_1.DynamoAuthTokenDAO();
    }
    createImageDAO() {
        return new S3ImageDAO_1.S3ImageDAO();
    }
}
exports.DynamoDAOFactory = DynamoDAOFactory;
