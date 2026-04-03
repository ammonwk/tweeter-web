import { UserDto } from "tweeter-shared";
export interface IUserDAO {
    putUser(alias: string, passwordHash: string, firstName: string, lastName: string, imageUrl: string): Promise<void>;
    getUser(alias: string): Promise<UserDto | null>;
    getPasswordHash(alias: string): Promise<string | null>;
}
