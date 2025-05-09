const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

class S3Service {
    constructor() {
        this.client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        });
    }

    async getObject(key) {
        const s3Params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key
        };
        const command = new GetObjectCommand(s3Params);
        return await this.client.send(command);
    }

    async putObject(key, body, contentType) {
        const s3Params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: contentType,
        };
        const command = new PutObjectCommand(s3Params);
        return await this.client.send(command);
    }
}

const s3Service = new S3Service();
module.exports = s3Service;