import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.REGION as string,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
    },
});

export const s3BucketName = process.env.S3_BUCKET_NAME as string;
export const s3PrefixFolderName = process.env.S3_PREFIX_FOLDER_NAME as string;

export default s3Client; 