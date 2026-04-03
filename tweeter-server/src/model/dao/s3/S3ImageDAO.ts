import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { IImageDAO } from "../IImageDAO";

const BUCKET = "tweeter-profile-images-akunzler";
const REGION = "us-east-1";

export class S3ImageDAO implements IImageDAO {
  async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    const decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
