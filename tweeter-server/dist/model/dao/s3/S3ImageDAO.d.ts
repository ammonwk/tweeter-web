import { IImageDAO } from "../IImageDAO";
export declare class S3ImageDAO implements IImageDAO {
    putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}
