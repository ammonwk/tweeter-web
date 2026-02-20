import { UserService } from "../model/service/UserService";
import { ChangeEvent } from "react";
import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";

export interface RegisterView {
    displayErrorMessage: (message: string) => void;
    setImageBytes: (imageBytes: Uint8Array) => void;
    setImageFileExtension: (imageFileExtension: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    setImageUrl: (imageUrl: string) => void;
    navigate: (path: string) => void;
    updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken, rememberMe: boolean) => void;
}

export class RegisterPresenter {
  private _view: RegisterView;
  public userService: UserService;

  public constructor(view: RegisterView) {
      this._view = view;
      this.userService = new UserService();
  }

  protected get view() {
    return this._view;
  }

  public checkSubmitButtonStatus(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageBytes ||
      !imageBytes.length
    );
  };

  public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  };

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };

  public registerOnEnter(event: React.KeyboardEvent<HTMLElement>, firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean) {
    if (event.key == "Enter" && !this.checkSubmitButtonStatus(firstName, lastName, alias, password, imageBytes, imageFileExtension)) {
      this.doRegister(firstName, lastName, alias, password, imageBytes, imageFileExtension, rememberMe);
    }
  };

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  };

  public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
    } finally {
      this.view.setIsLoading(false);
    }
  };
}
