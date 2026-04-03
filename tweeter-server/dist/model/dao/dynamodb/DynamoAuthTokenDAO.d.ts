import { IAuthTokenDAO } from "../IAuthTokenDAO";
export declare class DynamoAuthTokenDAO implements IAuthTokenDAO {
    private readonly client;
    private readonly tableName;
    putAuthToken(token: string, timestamp: number, alias: string): Promise<void>;
    getAuthToken(token: string): Promise<{
        alias: string;
        timestamp: number;
    } | null>;
    deleteAuthToken(token: string): Promise<void>;
}
