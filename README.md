# MediwoxPlus
**Mediwox Plus** is a cloud-based healthcare app using React.js and AWS. It enables doctors and patients to manage appointments via role-based dashboards. AWS Lambda handles serverless data fetching from DynamoDB, with API Gateway support. Features include smart filtering, real-time stats, and specialty-based appointment views.

MediWox – Serverless Hospital Management System using AWS

Documentation link: 

Youtube link:


INTRODUCTION:

MediWox is a cloud based, full-stack web application that automates healthcare services like, patient registration, appointment booking, and facilitating doctor-patient coordination. Through the use of AWS services in its overall architecture, MediWox provides the user with a secure, reliable, stackable solution, that is serverless, with the changing goals and needs of modern healthcare systems.

HOW OUR MEDIWOX WEBSITE USED AWS LAMBDA:

The **Lambda functions in the Mediwox system** form the core of its cloud-based backend, enabling secure, scalable, and intelligent healthcare operations. The `LoginHandler` is responsible for authenticating both patients and doctors using their email. If the user’s email is unverified, it leverages Amazon SES to initiate the verification process, ensuring that only authorized users gain access to the platform. Upon successful login, patients can use the `AppointmentHandler`, which facilitates appointment creation by intelligently matching them with available doctors based on specialty and schedules. Once an appointment is made, the details are stored in DynamoDB, and notifications are triggered via SNS or SES to keep both parties informed. For doctors, the `DoctorAppointmentsHandler` retrieves and displays all relevant appointments in their dashboard, filtered by date and specialty, helping them manage their daily schedule efficiently. To ensure data reliability and availability, the `backupToS3` function periodically exports critical appointment and user data from DynamoDB to Amazon S3. This not only provides a secure backup mechanism for disaster recovery but also enables further analytics and compliance-friendly archiving of healthcare records.

AWS SERVICES:

1. Amazon DynamoDB:

Amazon DynamoDB is a fully managed, serverless NoSQL database, which allows it to provide low-latency performance no matter the scale. It is designed for agile application development with consistent, single-digit millisecond response times and massive workloads while eliminating the need to manage underlying resources.

Role of this service in MediWox: 

It provides the primary database for all user and appointment tracking data.

The following tables are used:

•	Doctors - Doctor name, specialty, availability, experience.

•	Appointments - Appointment entries, issues, assigned doctors. 

Enables fast read/write read and write operations for lookups and bookings.

2. AWS Lambda:

AWS Lambda is a serverless compute service that lets run the code in response to events and automatically manage the compute resources. It removes the need for the provisioning or managing servers.

Service Integration in MediWox Architecture:

Triggered when a patient submits an appointment form.

Functionality:

•	Get appointment and issue data from DynamoDB.

•	Filter doctors by specialty.

•	Utilize round-robin to assign a doctor.

•	Check availability.

•	Update Appointments/Doctors tables.

•	Trigger SNS and SES for notifications.

A different scheduled Lambda function does the following:

•	Move old patient records (greater than 1 day old) to Amazon S3.

•	Runs daily with CloudWatch Events.

3. API Gateway:
   
Amazon API Gateway (Short Description)

Amazon API Gateway is a fully managed service that routes HTTP requests to AWS Lambda functions, acting as the entry point for the MediWox backend.

Role in MediWox:

It connects the frontend (React) to backend Lambda functions for login, appointment booking, and doctor dashboards. It also supports CORS and secures communication between components.

Used Endpoints:
/
/appointment
POST: Create new appointment (AppointmentHandler)
OPTIONS: CORS support
/appointment/{patientId}
GET: Fetch patient’s appointments
OPTIONS: CORS
/doctor
OPTIONS: CORS
/doctor/{doctorId}
GET: Fetch doctor’s appointments (DoctorAppointmentsHandler)
POST: (Optional) Update doctor data
OPTIONS: CORS
/login
POST: Authenticate user (LoginHandler)
OPTIONS: CORS


4. Amazon SNS (Simple Notification Service):
   
Amazon SNS is a fully managed service for sending text (SMS), email and mobile push notifications. It provides a simple and low-cost mechanism to send notifications to users.

Contribution to System functionality:

Post-appointment: Sends SMS notifications to notify.

•	Patients that the doctor has been assigned for the appointment.

•	Doctors that a new patient has been assigned to them.

5. Amazon SES (Simple Email Service):
    
Amazon SES is a cloud-based email service that can use to send transactional, marketing or notification emails. Amazon SES is designed to provide high deliverability and it's easy to integrate with the application.

Role of this service in MediWox:

After a successful appointment:

•	Patient receive an email with all the details of their appointment and doctor assignment.

Creates communication in addition to an SMS, and confirms details in detail.

6. Amazon S3 (Simple Storage Service):
    
Amazon S3 is an object storage service designed to store and retrieve unlimited amounts of data from anywhere. It is known for its durability, scalable storage, and low cost.

Service Utilization in MediWox:

Keep patient data that is inactive and no longer needs to be accessed (older than 1 day). 

A scheduled Lambda function is set to run every 24 hours to: 

•	Read outdated patient records from a Patients table in DynamoDB. 

•	Place them into organized folders within an S3 bucket for archival. 

This provides backup of data, compliance, and efficient storage and retrieval.

7. Amazon CloudWatch Events:
    
Amazon CloudWatch Events allows you to schedule an invocation of any AWS services, such as Lambda, and allows you to schedule or trigger invocations based on rules. You can automate actions within AWS based on a time-based interval in CloudWatch Events, or based on changes to a resource (a rule).

How it is applied in MediWox:

It will trigger the scheduled Lambda function every 24 hours.

It  can facilitate automating:

•	Archiving outdated patient records from DynamoDB to S3.

Helps to facilitate regular back up and cleanup of no intervention.

8. AWS IAM (Identity and Access Management):
    
AWS IAM is a web service that provides secure control access to AWS services and resources for users. IAM allows for the creation of users, role, and permissions on the principle of "least privilege." 

Functionality:

Roles were created for the Lambda function to obtain access to: 

•	DynamoDB (read/write) 

•	SNS and SES (to send messages) 

•	S3 (putObjects) 

•	API Gateway

MEDIWOX SYSTEM WORKFLOW

1. Doctor and Patient Login:
   
Login Attempt: The doctor fills in the registered email on the login screen.

Verification: Credentials are checked against the authenticated doctors list.

Access Granted: Only the approved and authenticated doctors will be taken to their dashboard, while others will not have access.

Patient log-in: Upon first-time log-in, the new patient enters their first name, last name, and email before logging in.

Email verification sent via AWS SES: An email verification email is sent to the email address using AWS SES.

Access Control: Only verified users will be allowed to access the patient dashboard and book appointments.

2. Patient Dashboard:
   
The Patient Dashboard in MediWox provides a simple platform for facilitating health and appointments. After successful login and verification, patients can:

•	Book Appointments with a selection of doctors.

•	Research Doctors by different specialties (e.g. Cardiology, Dermatology).

•	Review Ratings and Availability of Doctors.

•	Get Information on Hospitals including ranking, patient star ratings and number of experts.

•	Access Patient Guidelines that have Do's and Don'ts to maintain a safe consultation.

3. Doctor Dashboard:

MediWox Doctor Dashboard is a structured and visual interface for doctors to manage patients' schedule and appointments easily and efficiently.

Key Features:

Statistics Displayed in Real-Time: Daily statistics including Total and Completed appointments.

Appointments Graph: This chart allows you to view patient flow for that specific day while also allowing filtering by date and specialties.

Filter Tool: Doctors can only access clinic appointment for their specific specialties and designated dates from their schedules.

Your Schedule: Your specific daily appointments with real-time updates.

4. Descriptions of Lambda Functions:

4.1. LoginHandler

Goal: To authenticate users (patients/doctors) through their email or phone number.

Workflow: If email is not verified, the verification email is sent through Amazon SES.

Security: Only verified or authorized users have access.

4.2. AppointmentHandler

Goal: Create a new appointment when a patient submits the form.

Workflow: Pairs the patient with doctors based on availability and specialty.

Actions: Keeps the appointment in DynamoDB. Triggers SNS/SES to notify the doctor and the patient.

4.3. DoctorAppointmentsHandler

Goal: Retrieve all the appointments that belong to the doctor at that given time.

Use case: This functionality powers the doctor dashboard to display daily appointments filtered by date or specialty.

4.4. backupToS3

Goal: To regularly back up critical data from DynamoDB to Amazon S3.

Advantages: Disaster recovery; analytics; secure way to archive healthcare record storage.

4.5. Booking Flow:

•	Patient submits form, including type of issue.

•	Data written to DynamoDB.

•	This triggers Lambda to check:

4.5.1.	 If there is a matching doctor for booking.

4.5.2.	 If there is availability to check in.

4.5.3.	 To update the database.

4.5.4.	 SNS sends SMS to both users.

4.5.5.	 SES sends email to both users.
 
5. Daily Archival Flow:
   
•	CloudWatch Event triggers the Lambda.

•	Lambda reads old patient records from DynamoDB.

•	It copies/Moves to S3, for longer-term storage.

6. Overall Workflow
 
MediWox implements a completely serverless cloud-native architecture, which is based on several key AWS services, to improve hospital management practices. The user front end interacts with the Amazon API Gateway acting as a service mesh and returns user requests (for log in, booking, fetching appointments, etc.) to an AWS Lambda functions. The stateless compute service implements the business logic, fetches information from Amazon DynamoDB via the doctors and patients tables, interacts with Amazon SES to send email notifications, including eventually generating an Amazon SNS for SMS messaging. There are a variety of data points concerning appointments that are backed up to Amazon S3, and monitoring will happen via CloudWatch for observability and logging purposes.

7. Descriptions of Lambda Functions:

7.1. LoginHandler
 
Goal: To authenticate users (patients/doctors) through their email or phone number.

Workflow: If email is not verified, the verification email is sent through Amazon SES.

Security: Only verified or authorized users have access.

7.2. AppointmentHandler
 
Goal: Create a new appointment when a patient submits the form.

Workflow: Pairs the patient with doctors based on availability and specialty.

Actions: Keeps the appointment in DynamoDB. Triggers SNS/SES to notify the doctor and the patient.

7.3. DoctorAppointmentsHandler

Goal: Retrieve all the appointments that belong to the doctor at that given time.

Use case: This functionality powers the doctor dashboard to display daily appointments filtered by date or specialty.

7.4. backupToS3

Goal: To regularly back up critical data from DynamoDB to Amazon S3.

Advantages: Disaster recovery; analytics; secure way to archive healthcare record storage.


 
### 🧠 AWS vs Azure Comparison for MediWox

| **Comparison Area**   | **AWS Advantage**                                               | **Azure**                                            |
|------------------------|----------------------------------------------------------------|------------------------------------------------------|
| Serverless Compute     | Mature support with Lambda, integrated easily                  | Azure Functions are newer                           |
| Notifications          | Built-in SNS + SES (no external service needed)                | Requires SendGrid/Twilio setup                      |
| Database               | DynamoDB is optimized for serverless usage                     | CosmosDB is more complex                            |
| Storage                | S3 has industry-leading durability and ease of use             | Azure Blob has parity but slightly steeper learning |
| Ecosystem              | Serverless-first architecture, free-tier friendly              | Slightly more setup needed                          |


PROJECT OUTCOMES:

•	Real-time booking or appointments and intelligent assignment of doctors.

•	Automatic SMS and email notifications using SNS for SMS and SES for email.

•	Efficient doctor allocation using Lambda and round-robin logic.

•	Automatic archiving of patient case-history data to S3.

•	A completely serverless and scalable infrastructure.


FUTURE SCOPE:

•	Integrate user authentication with Amazon Cognito.

•	Add video call consultation integration. 

•	Implement analytics dashboard with Amazon QuickSight.

•	Currently emails can only be sent to verified email addresses. At a future date, MediWox will apply for SES production access so that emails can be sent to all patients without human verification.


CONCLUSION:

The Hospital Management System uses the power of AWS serverless technologies to provide real-time interactivity, massive data processing capabilities, and scalable communication - all without the need for server management. This project shows how cloud services can make healthcare systems more efficient, they are more automated and user-friendly.


