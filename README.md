# MediLink Telemedicine Platform

MediLink is a full-stack telemedicine platform designed to connect patients with healthcare providers for scheduling appointments, secure messaging, video consultations, and medical record management.

## Features

* **Authentication**: Email/password login, Google OAuth, OTP verification, and JWT-based role claims (patient, doctor, admin).
* **Appointment Scheduling**: Doctors set availability; patients can book, reschedule, and cancel appointments.
* **Secure Messaging**: Encrypted chat with unread indicators and push notifications.
* **Video Consultation**: Real-time video calls powered by Twilio, with backend-issued tokens and client-side room handling.
* **Medical Records**: Patients can upload and share images/PDFs; doctors can annotate and download records.
* **Pharmacy Locator**: Geolocation-driven map showing nearby pharmacies with route links.
* **Notifications**: Email and in-app reminders using Node-cron and Nodemailer.
* **Performance Optimizations**: Gzip compression, database indexing, and client-side code splitting improve load times and resource usage.
* **Security Measures**: Comprehensive OWASP ZAP scans and Helmet headers to eliminate high-severity vulnerabilities.

## Tech Stack

* **Frontend**: React, Tailwind CSS, React Router, Redux Toolkit
* **Backend**: Node.js, Express, MongoDB with Mongoose ODM
* **Real-Time & Media**: Twilio Programmable Video, WebRTC
* **Storage & Uploads**: Cloudinary
* **Authentication & Security**: JSON Web Tokens, Passport.js (Google OAuth), Speakeasy (OTP), bcrypt, Helmet, CORS restrictions
* **Notifications**: Node-cron, Nodemailer

## Live Demo & Repository

* **Live App**: [https://medilink-six.vercel.app/](https://medilink-six.vercel.app/)
* **Source Code**: [github.com/priyanshsolanki/medilink](https://github.com/priyanshsolanki/medilink)

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
