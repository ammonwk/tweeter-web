export interface IAuthTokenDAO {
  putAuthToken(token: string, timestamp: number, alias: string): Promise<void>;

  getAuthToken(token: string): Promise<{ alias: string; timestamp: number } | null>;

  deleteAuthToken(token: string): Promise<void>;
}
