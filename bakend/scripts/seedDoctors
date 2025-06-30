// scripts/seedDoctors.js
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const docClient = new AWS.DynamoDB.DocumentClient();

const doctors = require('./mockData.json'); // convert mockData.js to JSON

async function seedDoctors() {
  for (const doctor of doctors) {
    const params = {
      TableName: 'Doctors',
      Item: doctor,
    };

    try {
      await docClient.put(params).promise();
      console.log(`Inserted doctor: ${doctor.name}`);
    } catch (err) {
      console.error('Error inserting doctor:', err);
    }
  }
}

seedDoctors();
