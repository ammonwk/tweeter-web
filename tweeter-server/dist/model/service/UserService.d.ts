import { UserDto, AuthTokenDto } from "tweeter-shared";
export declare class UserService {
    login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]>;
    register(firstName: string, lastName: string, alias: string, password: string, userImageBytes: string, imageFileExtension: string): Promise<[UserDto, AuthTokenDto]>;
    getUser(token: string, alias: string): Promise<UserDto | null>;
    logout(token: string): Promise<void>;
}
