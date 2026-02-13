import { UserService } from "../model/service/UserService";
import { ChangeEvent, useState } from "react";
import { Buffer } from "buffer";

export class RegisterPresenter {
    public userService: UserService;

    public constructor() {
        this.userService = new UserService();
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string
      ) {
        return this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
          );
      }

      public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        this.handleImageFile(file, );
      };

      public handleImageFile (file: File | undefined, setImageUrl: Function) {
        if (file) {
          setImageUrl(URL.createObjectURL(file));

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

            setImageBytes(bytes);
          };
          reader.readAsDataURL(file);

          // Set image file extension (and move to a separate method)
          const fileExtension = getFileExtension(file);
          if (fileExtension) {
            setImageFileExtension(fileExtension);
          }
        } else {
          setImageUrl("");
          setImageBytes(new Uint8Array());
        }
      };

      public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
      };
}
