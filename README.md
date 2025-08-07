# MediLink Telemedicine Platform

MediLink is a full-stack telemedicine platform designed to connect patients with healthcare providers for scheduling appointments, secure messaging, video consultations, and medical record management. fileciteturn1file2L72-L79

## Features

* **Authentication**: Email/password login, Google OAuth, OTP verification, and JWT-based role claims (patient, doctor, admin). fileciteturn1file6L31-L34
* **Appointment Scheduling**: Doctors set availability; patients can book, reschedule, and cancel appointments. fileciteturn1file6L37-L44
* **Secure Messaging**: Encrypted chat with unread indicators and push notifications. fileciteturn1file6L47-L51
* **Video Consultation**: Real-time video calls powered by Twilio, with backend-issued tokens and client-side room handling. fileciteturn1file6L57-L64
* **Medical Records**: Patients can upload and share images/PDFs; doctors can annotate and download records. fileciteturn1file6L67-L71
* **Pharmacy Locator**: Geolocation-driven map showing nearby pharmacies with route links. fileciteturn1file6L73-L81
* **Notifications**: Email and in-app reminders using Node-cron and Nodemailer. fileciteturn1file6L83-L87
* **Performance Optimizations**: Gzip compression, database indexing, and client-side code splitting improve load times and resource usage. fileciteturn1file2L92-L98
* **Security Measures**: Comprehensive OWASP ZAP scans and Helmet headers to eliminate high-severity vulnerabilities. fileciteturn1file2L98-L102

## Tech Stack

* **Frontend**: React, Tailwind CSS, React Router, Redux Toolkit
* **Backend**: Node.js, Express, MongoDB with Mongoose ODM fileciteturn1file6L105-L113
* **Real-Time & Media**: Twilio Programmable Video, WebRTC
* **Storage & Uploads**: Cloudinary
* **Authentication & Security**: JSON Web Tokens, Passport.js (Google OAuth), Speakeasy (OTP), bcrypt, Helmet, CORS restrictions
* **Notifications**: Node-cron, Nodemailer

## Live Demo & Repository

* **Live App**: [https://medilink-six.vercel.app/](https://medilink-six.vercel.app/) fileciteturn1file1L61-L68
* **Source Code**: [github.com/priyanshsolanki/medilink](https://github.com/priyanshsolanki/medilink) fileciteturn1file1L61-L68

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/priyanshsolanki/medilink.git
   cd medilink
   ```

2. **Install dependencies**

   ```bash
   # Backend
   npm install

   # Frontend
   cd client
   npm install
   ```

3. **Configure environment variables**
   Copy `.env.example` to `.env` and fill in the required values:

   ```ini
   # MongoDB
   MONGODB_URI=

   # JWT
   JWT_SECRET=

   # Twilio
   TWILIO_ACCOUNT_SID=
   TWILIO_API_KEY=
   TWILIO_API_SECRET=

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   # Google OAuth
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```

4. **Run the application**

   ```bash
   # In the project root
   npm run dev

   # In a separate terminal, start the frontend
   cd client
   npm start
   ```

The backend will run on `http://localhost:5050` and the frontend on `http://localhost:3000`.

## Usage

Once both servers are running, visit `http://localhost:3000` in your browser to register and start using MediLink to schedule appointments, chat securely, attend video consultations, and manage medical records.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
