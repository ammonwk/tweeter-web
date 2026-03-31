import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
    setDisplayedUser: (user: User) => void;
    navigate: (path: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {

    public constructor(view: UserNavigationView) {
        super(view);
    }

    public async navigateToUser(
        event: React.MouseEvent,
        featurePath: string,
        authToken: AuthToken | undefined,
        displayedUser: User
      ): Promise<void> {    
        await this.doFailureReportingOperation(async () => {
          const alias = this.extractAlias(event.target.toString());
    
          const toUser = await this.userService.getUser(authToken!, alias);
    
          if (toUser) {
            if (!toUser.equals(displayedUser)) {
              this.view.setDisplayedUser(toUser);
              this.view.navigate(`/${featurePath}/${toUser.alias}`);
            }
          }
        }, "get user");
    }

    private extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    }
}
