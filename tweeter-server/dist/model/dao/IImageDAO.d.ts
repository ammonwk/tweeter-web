export interface IImageDAO {
    putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}
