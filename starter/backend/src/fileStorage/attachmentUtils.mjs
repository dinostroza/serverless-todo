import {DeleteObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client()

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function getUploadUrl(todoId){

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: todoId
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: urlExpiration
    })

    return presignedUrl
}

export async function deleteImage(todoId){
    const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: todoId
    });

    await s3Client.send(command);

    return todoId
}