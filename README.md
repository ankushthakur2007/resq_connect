# Disaster Response Platform

A real-time disaster management and emergency response coordination application built during a 24-hour hackathon.

## Features

- 🚨 **Emergency Reporting**: Report incidents with geolocation data
- 🗺️ **Live Map**: Real-time visualization of emergencies on an interactive map
- 💬 **Volunteer Chat**: Coordinate response efforts through real-time chat
- 📊 **Dashboard**: Monitor statistics and analytics for emergency management
- 📱 **Notifications**: Alert system for emergency notifications (SMS via Twilio)

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Supabase (Database, Authentication)
- **Real-time**: Pusher
- **Maps**: React Leaflet
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account
- Pusher account
- (Optional) Twilio account for SMS notifications

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/disaster-response.git
   cd disaster-response
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required environment variables

4. Set up Supabase:
   - Create a new Supabase project
   - Create the following tables:
     - `incidents`: For storing emergency reports
     - `chat_messages`: For storing volunteer chat messages

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### incidents
- `id`: UUID (primary key)
- `type`: String (flood, fire, earthquake, medical, other)
- `location`: Point (PostGIS geography)
- `description`: Text
- `status`: String (pending, in_progress, resolved)
- `reported_at`: Timestamp

### chat_messages
- `id`: String (primary key)
- `user`: String
- `text`: Text
- `timestamp`: Timestamp

## Deployment

This application can be deployed to Vercel or any other Next.js compatible hosting service.

## License

MIT
