// insertToDynamo.js

const AWS = require('aws-sdk');
const path = require('path');
const { doctors, appointments } = require(path.join(__dirname, 'Datamock.js'));

// Set AWS region
AWS.config.update({ region: 'ap-south-1' });

// Create DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Define your table names
const DOCTOR_TABLE = 'Doctors';
const APPOINTMENT_TABLE = 'Appointments';

// Helper function to upload array of items to a table
const uploadToTable = async (items, tableName) => {
  for (const item of items) {
    const params = {
      TableName: tableName,
      Item: item
    };

    try {
      await dynamoDB.put(params).promise();
      console.log(`✅ Inserted into ${tableName}: ${item.id || item.name}`);
    } catch (error) {
      console.error(`❌ Failed to insert into ${tableName}: ${item.id || item.name}`, error);
    }
  }
};

// Main function to trigger the uploads
const main = async () => {
  console.log('🚀 Uploading mock data to DynamoDB...');

  await uploadToTable(doctors, DOCTOR_TABLE);
  await uploadToTable(appointments, APPOINTMENT_TABLE);

  console.log('✅ All mock data uploaded successfully.');
};

main();
