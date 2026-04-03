"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ImageDAO = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const BUCKET = "tweeter-profile-images-akunzler";
const REGION = "us-east-1";
class S3ImageDAO {
    async putImage(fileName, imageStringBase64Encoded) {
        const decodedImageBuffer = Buffer.from(imageStringBase64Encoded, "base64");
        const s3Params = {
            Bucket: BUCKET,
            Key: "image/" + fileName,
            Body: decodedImageBuffer,
            ContentType: "image/png",
            ACL: client_s3_1.ObjectCannedACL.public_read,
        };
        const c = new client_s3_1.PutObjectCommand(s3Params);
        const client = new client_s3_1.S3Client({ region: REGION });
        try {
            await client.send(c);
            return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
        }
        catch (error) {
            throw Error("s3 put image failed with: " + error);
        }
    }
}
exports.S3ImageDAO = S3ImageDAO;
