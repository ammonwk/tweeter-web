import "isomorphic-fetch";
import { ServerFacade } from "./ServerFacade";
import { AuthToken, User } from "tweeter-shared";

describe("ServerFacade Integration Tests", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  jest.setTimeout(15000);

  test("register returns a user and auth token", async () => {
    const [user, authToken] = await serverFacade.register({
      firstName: "Test",
      lastName: "User",
      alias: "@testuser",
      password: "password123",
      userImageBytes: "dGVzdA==", // base64 "test"
      imageFileExtension: ".png",
    });

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(user.firstName).toBeDefined();
    expect(user.alias).toBeDefined();

    expect(authToken).toBeDefined();
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(authToken.token).toBeDefined();
  });

  test("getMoreFollowers returns a page of users", async () => {
    const [users, hasMore] = await serverFacade.getMoreFollowers({
      token: "test-token",
      userAlias: "@allen",
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
      token: "test-token",
      user: {
        firstName: "Allen",
        lastName: "Anderson",
        alias: "@allen",
        imageUrl: "https://example.com/image.png",
      },
    });

    expect(count).toBeDefined();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("getFolloweeCount returns a number", async () => {
    const count = await serverFacade.getFolloweeCount({
      token: "test-token",
      user: {
        firstName: "Allen",
        lastName: "Anderson",
        alias: "@allen",
        imageUrl: "https://example.com/image.png",
      },
    });

    expect(count).toBeDefined();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
