// uploadMockData.js
const AWS = require('aws-sdk');
const path = require('path');
const { doctors, appointments } = require(path.join(__dirname, 'Datamock.js'));

// Configure AWS region
AWS.config.update({ region: 'ap-south-1' }); // ⚠️ Change if needed

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Table Names — ensure they exist in DynamoDB
const DOCTOR_TABLE = 'Doctors';
const APPOINTMENT_TABLE = 'Appointments';

/**
 * Uploads an array of items to a DynamoDB table
 * @param {Array} items - The data objects to insert
 * @param {string} tableName - DynamoDB table name
 */
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
      console.error(`❌ Error inserting into ${tableName}: ${item.id || item.name}`);
      console.error(error.message);
    }
  }
};

/**
 * Main execution function
 */
const main = async () => {
  console.log('🚀 Starting mock data upload to DynamoDB...\n');

  console.log('📥 Uploading doctors...');
  await uploadToTable(doctors, DOCTOR_TABLE);

  console.log('\n📥 Uploading appointments...');
  await uploadToTable(appointments, APPOINTMENT_TABLE);

  console.log('\n✅ Upload complete.');
};

main();
