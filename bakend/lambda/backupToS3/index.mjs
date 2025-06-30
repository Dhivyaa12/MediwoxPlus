import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "ap-southeast-2" });

export const handler = async (event) => {
  try {
    console.log("Event received:", JSON.stringify(event, null, 2));

    for (const record of event.Records) {
      const tableName = record.eventSourceARN.split("/")[1];
      const timestamp = new Date().toISOString();

      const backupData = {
        table: tableName,
        action: record.eventName,
        newData: record.dynamodb.NewImage || {},
        oldData: record.dynamodb.OldImage || {},
        time: timestamp
      };

      const command = new PutObjectCommand({
        Bucket: "hospital-backup-history", // your S3 bucket
        Key: `backup/${tableName}/${timestamp}.json`,
        Body: JSON.stringify(backupData),
        ContentType: "application/json"
      });

      await s3.send(command);
      console.log(`Backup for ${tableName} saved.`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify("Backup success")
    };

  } catch (error) {
    console.error("Backup failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify("Backup error")
    };
  }
};
