import { allowedDoctors } from './Datamock.js';
import {
  SESClient,
  VerifyEmailIdentityCommand
} from "@aws-sdk/client-ses";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
};

const sesClient = new SESClient({ region: 'ap-southeast-2' });

export const handler = async (event) => {
  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Missing request body' }),
      };
    }

    const body = JSON.parse(event.body);
    const { email, password, userType } = body;

    if (!email || !userType) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Email and userType are required' }),
      };
    }

    // Doctor login
    if (userType === 'doctor') {
      const doctor = allowedDoctors.find(
        doc => doc.email === email && doc.password === password
      );

      if (doctor) {
        // Optionally trigger SES verification
        try {
          const verifyCommand = new VerifyEmailIdentityCommand({ EmailAddress: email });
          await sesClient.send(verifyCommand);
          console.log(`SES verification triggered for doctor ${email}`);
        } catch (err) {
          console.error(`SES doctor verify error: ${err.message}`);
        }

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            message: 'Doctor login successful',
            doctorId: doctor.doctorId,
            name: doctor.name,
            email: doctor.email
          }),
        };
      } else {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Invalid doctor credentials' }),
        };
      }
    }

    // Patient login
    else if (userType === 'patient') {
      try {
        const verifyCommand = new VerifyEmailIdentityCommand({ EmailAddress: email });
        await sesClient.send(verifyCommand);
        console.log(`SES verification triggered for patient ${email}`);

        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            message: 'Patient login successful',
            email,
          }),
        };
      } catch (err) {
        console.error(`SES patient verify error: ${err.message}`);
        return {
          statusCode: 500,
          headers: corsHeaders,
          body: JSON.stringify({
            message: 'Failed to send verification email',
            error: err.message,
          }),
        };
      }
    }

    // Invalid userType
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Invalid userType' }),
    };

  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Server error',
        error: err.message,
      }),
    };
  }
};
