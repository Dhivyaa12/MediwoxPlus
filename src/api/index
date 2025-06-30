const AWS = require('aws-sdk');
const { doctors, appointments } = require('./Datamock');

// Set the region and DynamoDB
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const insertData = async (tableName, items) => {
    const responses = [];

    for (const item of items) {
      const params = {
        TableName: tableName,
        Item: item,
      };

      try {
        await dynamoDB.put(params).promise();
        responses.push({ id: item.id, status: 'success' });
      } catch (error) {
        responses.push({ id: item.id, status: 'error', error: error.message });
      }
    }

    return responses;
  };

  const doctorResult = await insertData('Doctors', doctors);
  const appointmentResult = await insertData('Appointments', appointments);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Upload finished',
      doctorResult,
      appointmentResult,
    }),
  };
};
