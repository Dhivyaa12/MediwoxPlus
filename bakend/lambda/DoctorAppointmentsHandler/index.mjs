import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (event) => {
  // Preflight CORS handling for OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "CORS preflight passed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { doctorId, date } = body;

    console.log("📥 Request Body:", body);

    // Validate inputs
    if (!doctorId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "doctorId is required" }),
      };
    }

    const params = {
      TableName: "Appointment",
      FilterExpression: "#doctorId = :doctorId",
      ExpressionAttributeNames: {
        "#doctorId": "doctorId",
      },
      ExpressionAttributeValues: {
        ":doctorId": doctorId,
      },
    };

    const data = await docClient.send(new ScanCommand(params));
    let appointments = data.Items || [];

    // Filter by date if provided
    if (date) {
      appointments = appointments.filter(
        (item) => item.appointmentDate === date
      );
    }

    console.log(
      "📦 Final Appointments Returned to Frontend:",
      JSON.stringify(appointments, null, 2)
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ appointments }),
    };
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
