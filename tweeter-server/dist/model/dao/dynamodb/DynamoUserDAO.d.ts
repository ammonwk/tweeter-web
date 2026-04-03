import { UserDto } from "tweeter-shared";
import { IUserDAO } from "../IUserDAO";
export declare class DynamoUserDAO implements IUserDAO {
    private readonly client;
    private readonly tableName;
    putUser(alias: string, passwordHash: string, firstName: string, lastName: string, imageUrl: string): Promise<void>;
    getUser(alias: string): Promise<UserDto | null>;
    getPasswordHash(alias: string): Promise<string | null>;
}
