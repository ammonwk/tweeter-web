"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DynamoDAOFactory_1 = require("../../model/dao/dynamodb/DynamoDAOFactory");
const handler = async (event) => {
    const factory = new DynamoDAOFactory_1.DynamoDAOFactory();
    const feedDAO = factory.createFeedDAO();
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        const feedItems = message.followers.map((alias) => ({
            receiverAlias: alias,
            timestamp: message.timestamp,
            senderAlias: message.senderAlias,
            post: message.post,
        }));
        if (feedItems.length > 0) {
            await feedDAO.putFeedItemBatch(feedItems);
        }
    }
};
exports.handler = handler;
