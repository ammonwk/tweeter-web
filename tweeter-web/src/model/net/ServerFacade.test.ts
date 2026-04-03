import "isomorphic-fetch";
import { ServerFacade } from "./ServerFacade";
import { AuthToken, User } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;
  let authToken: AuthToken;

  jest.setTimeout(15000);

  beforeAll(async () => {
    serverFacade = new ServerFacade();
    // Login to get a valid auth token for authenticated tests
    const [user, token] = await serverFacade.login({
      alias: "@testuser",
      password: "password123",
    });
    authToken = token;
  });

  test("register returns a user and auth token", async () => {
    const uniqueAlias = `@regtest${Date.now()}`;
    const [user, token] = await serverFacade.register({
      firstName: "Test",
      lastName: "User",
      alias: uniqueAlias,
      password: "password123",
      userImageBytes:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      imageFileExtension: ".png",
    });

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user.alias).toBe(uniqueAlias);

    expect(token).toBeDefined();
    expect(token).toBeInstanceOf(AuthToken);
    expect(token.token).toBeDefined();
  });

  test("getMoreFollowers returns a page of users", async () => {
    const [users, hasMore] = await serverFacade.getMoreFollowers({
      token: authToken.token,
      userAlias: "@mainuser",
      pageSize: 5,
      lastItem: null,
    });

    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
    expect(users.length).toBeLessThanOrEqual(5);
    expect(users[0]).toBeInstanceOf(User);
    expect(users[0].alias).toBeDefined();
    expect(typeof hasMore).toBe("boolean");
  });

  test("getFollowerCount returns a number", async () => {
    const count = await serverFacade.getFollowerCount({
      token: authToken.token,
      user: {
        firstName: "Main",
        lastName: "User",
        alias: "@mainuser",
        imageUrl: "https://example.com/image.png",
      },
    });

    expect(count).toBeDefined();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("getFolloweeCount returns a number", async () => {
    const count = await serverFacade.getFolloweeCount({
      token: authToken.token,
      user: {
        firstName: "Main",
        lastName: "User",
        alias: "@mainuser",
        imageUrl: "https://example.com/image.png",
      },
    });

    expect(count).toBeDefined();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
