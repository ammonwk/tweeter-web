import "isomorphic-fetch";
import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "./PostStatusPresenter";
import { ServerFacade } from "../model/net/ServerFacade";
import { instance, mock, verify, when, anything, capture } from "ts-mockito";

describe("PostStatusPresenter Integration Test", () => {
  jest.setTimeout(30000);

  let mockView: PostStatusView;
  let presenter: PostStatusPresenter;
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    when(mockView.displayToast(anything())).thenReturn("toast-id");
    presenter = new PostStatusPresenter(instance(mockView));
  });

  test("login, post status, verify 'Successfully Posted!' and story retrieval", async () => {
    // Step 1: Login a user
    const [user, authToken] = await serverFacade.login({
      alias: "@testuser",
      password: "password123",
    });

    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
    expect(authToken).toBeDefined();
    expect(authToken).toBeInstanceOf(AuthToken);

    // Step 2: Post a status via the Presenter
    const uniquePost = `Integration test post ${Date.now()}`;
    const newStatus = new Status(uniquePost, user, Date.now());

    await presenter.postStatus(authToken, newStatus);

    // Step 3: Verify "Status posted successfully" message displayed
    verify(mockView.displaySuccessMessage("Status posted successfully")).once();

    // Step 4: Retrieve story and confirm the status is there
    const [statuses, hasMore] = await serverFacade.getMoreStoryItems({
      token: authToken.token,
      userAlias: user.alias,
      pageSize: 10,
      lastItem: null,
    });

    expect(statuses).toBeDefined();
    expect(statuses.length).toBeGreaterThan(0);

    // Find our posted status
    const found = statuses.find((s) => s.post === uniquePost);
    expect(found).toBeDefined();
    expect(found!.user.alias).toBe(user.alias);
    expect(found!.post).toBe(uniquePost);
    expect(found!.timestamp).toBeDefined();
  });
});
