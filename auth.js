import axios from 'axios';

/**
 * Login request to AWS Lambda via API Gateway.
 * Supports both email/password and phone/otp.
 */
export const loginUser = async ({ email, password, phoneNumber, role }) => {
  try {
    const payload = phoneNumber
      ? { phoneNumber, password, role }
      : { email, password, role };

    const res = await axios.post(
      'https://9dkceq681h.execute-api.ap-southeast-2.amazonaws.com/prod/login',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    // AWS Lambda's API Gateway response wraps body in a string
    const parsed = typeof res.data.body === 'string' ? JSON.parse(res.data.body) : res.data.body;

    return parsed;
  } catch (err) {
    console.error('Login Error:', err);
    throw err;
  }
};
