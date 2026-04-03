import "isomorphic-fetch";
import { StatusService } from "./StatusService";
import { AuthToken, Status } from "tweeter-shared";

describe("StatusService Integration Test", () => {
  let statusService: StatusService;

  beforeAll(() => {
    statusService = new StatusService();
  });

  jest.setTimeout(15000);

  test("loadMoreStoryStatusItems returns a page of statuses", async () => {
    const authToken = AuthToken.Generate();

    const [statuses, hasMore] =
      await statusService.loadMoreStoryStatusItems(
        authToken,
        "@allen",
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
