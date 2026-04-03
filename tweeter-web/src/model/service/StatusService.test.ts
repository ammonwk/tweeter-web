import "isomorphic-fetch";
import { StatusService } from "./StatusService";
import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";

describe("StatusService Integration Test", () => {
  let statusService: StatusService;
  let authToken: AuthToken;

  jest.setTimeout(15000);

  beforeAll(async () => {
    statusService = new StatusService();
    // Login to get a valid auth token
    const serverFacade = new ServerFacade();
    const [user, token] = await serverFacade.login({
      alias: "@testuser",
      password: "password123",
    });
    authToken = token;
  });

  test("loadMoreStoryStatusItems returns a page of statuses", async () => {
    const [statuses, hasMore] =
      await statusService.loadMoreStoryStatusItems(
        authToken,
        "@testuser",
        5,
        null
      );

    expect(statuses).toBeDefined();
    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses.length).toBeLessThanOrEqual(5);

    const firstStatus = statuses[0];
    expect(firstStatus).toBeInstanceOf(Status);
    expect(firstStatus.post).toBeDefined();
    expect(firstStatus.user).toBeDefined();
    expect(firstStatus.user.alias).toBeDefined();
    expect(firstStatus.timestamp).toBeDefined();

    expect(typeof hasMore).toBe("boolean");
  });
});
