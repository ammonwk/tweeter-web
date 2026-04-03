import { StatusDto } from "tweeter-shared";

export interface IFeedDAO {
  putFeedItem(
    receiverAlias: string,
    timestamp: number,
    senderAlias: string,
    post: string
  ): Promise<void>;

  putFeedItemBatch(
    items: {
      receiverAlias: string;
      timestamp: number;
      senderAlias: string;
      post: string;
    }[]
  ): Promise<void>;

  getPageOfFeedItems(
    alias: string,
    pageSize: number,
    lastTimestamp: number | undefined
  ): Promise<[StatusDto[], boolean]>;
}
