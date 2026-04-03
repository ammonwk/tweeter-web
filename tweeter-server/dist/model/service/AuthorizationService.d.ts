import { DAOFactory } from "../dao/DAOFactory";
export declare class AuthorizationService {
    private factory;
    constructor(factory: DAOFactory);
    verifyToken(token: string): Promise<string>;
}
