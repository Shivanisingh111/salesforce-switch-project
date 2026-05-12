Salesforce Switch Dashboard ⚡

A full-stack Salesforce administration dashboard built using React.js, Node.js, Express.js, OAuth2, and Salesforce Tooling API.

Features
- Salesforce OAuth2 Login
- View Validation Rules
- Enable / Disable Validation Rules
- REST API Integration
- Responsive Dashboard UI
- Cloud Deployment using Vercel + Render

Tech Stack
- React.js
- Node.js
- Express.js
- Salesforce Tooling API
- OAuth2 PKCE Flow
- Axios

Live Demo
Frontend: https://salesforce-switch-project.vercel.app/

Backend:
https://salesforce-switch-backend-dhmp.onrender.com

Installation

cd backend
npm install
node index.js

Frontend

cd frontend
npm install
npm start

Environment Variables

Create .env inside backend:

CLIENT_ID=your_client_id
CLIENT_SECRET=your_secret
REDIRECT_URI=your_callback_url
LOGIN_URL=https://login.salesforce.com
