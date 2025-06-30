import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS SDK clients
const docClient = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'ap-southeast-2' });
const sns = new AWS.SNS({ region: 'ap-southeast-2' });

const topicArn = 'arn:aws:sns:ap-southeast-2:699475915811:PatientNotifications';
const tableName = 'Appointment';

// Symptom → Specialty mapping
const diseaseSpecialtyMap = {
  "Chest Pain": "Cardiology",
  "Skin Rash": "Dermatology",
  "Joint Pain": "Orthopedics",
  "Fever": "General Medicine",
  "Headache": "Neurology",
  "Stomach Pain": "Gastroenterology",
  "Back Pain": "Spine & Pain Specialist",
  "Allergies": "Allergy & Immunology",
  "Diabetes": "Endocrinology",
  "Hypertension": "General Medicine",
  "Other": "General Medicine"
};

export const handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight OK' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { patientName, symptoms, email, phoneNumber, appointmentDate } = body;

    if (!patientName || !symptoms || !email || !appointmentDate) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    const specialty = diseaseSpecialtyMap[symptoms];
    if (!specialty) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Unknown symptom provided' }),
      };
    }

    // 1. Fetch available doctors for the specialty
    const doctorsData = await docClient.scan({ TableName: 'Doctors' }).promise();
    const availableDoctors = doctorsData.Items.filter(
      doc => doc.available === true && doc.specialty === specialty
    );

    if (availableDoctors.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: `No available doctors for ${specialty}` }),
      };
    }

    // 2. Round-robin index tracking
    const rrKey = {
      TableName: tableName,
      Key: {
        appointmentId: `lastAssigned_${specialty}`,
        doctorId: 'system'
      }
    };

    const lastAssigned = await docClient.get(rrKey).promise();
    const lastIndex = lastAssigned.Item?.index ?? -1;
    const nextIndex = (lastIndex + 1) % availableDoctors.length;
    const assignedDoctor = availableDoctors[nextIndex];

    await docClient.put({
      TableName: tableName,
      Item: {
        appointmentId: `lastAssigned_${specialty}`,
        doctorId: 'system',
        index: nextIndex
      }
    }).promise();

    // 3. Save the appointment
    const appointmentId = uuidv4();
    const appointmentItem = {
      appointmentId,
      patientName,
      doctorId: assignedDoctor.Doctors_id || assignedDoctor.id,
      doctorName: assignedDoctor.name,
      appointmentDate,
      symptoms,
      email,
      phoneNumber: phoneNumber || 'N/A'
    };

    await docClient.put({
      TableName: tableName,
      Item: appointmentItem
    }).promise();

    // 4. Send email
    const emailBody = `Dear ${patientName},

    We are pleased to inform you that your appointment has been successfully scheduled.
    
    📅 **Appointment Details**
    - **Doctor:** Dr. ${assignedDoctor.name} (${assignedDoctor.specialty})
    - **Date & Time:** ${appointmentDate}
    - **Symptoms Reported:** ${symptoms}
    
    Please ensure you arrive at least 10 minutes early. If you have any previous medical records, kindly bring them along for a better consultation experience.
    
    If you need to reschedule or have any questions, feel free to contact our support team.
    
    Wishing you a speedy recovery,  
    MediwoxPlus Team`;    

    const emailParams = {
      Source: 'kishorkannank.aiml2023@citchennai.net',
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'Appointment Confirmation' },
        Body: { Text: { Data: emailBody } }
      }
    };

    await ses.sendEmail(emailParams).promise();

    // 5. Send SMS
    if (phoneNumber) {
      const smsMessage = `Hi ${patientName}, your appointment with ${assignedDoctor.name} on ${appointmentDate} is confirmed.`;
      await sns.publish({
        Message: smsMessage,
        PhoneNumber: phoneNumber
      }).promise();
    }

    // 6. Notify SNS topic
    const topicMessage = `📢 New Appointment\nPatient: ${patientName}\nDoctor: ${assignedDoctor.name}\nDate: ${appointmentDate}\nSymptoms: ${symptoms}`;
    await sns.publish({
      Message: topicMessage,
      TopicArn: topicArn
    }).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Doctor assigned, appointment booked, and notifications sent.',
        appointmentId,
        doctor: assignedDoctor.name
      }),
    };

  } catch (err) {
    console.error('❌ Error in appointment booking:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Internal server error',
        error: err.message
      }),
    };
  }
};
