# ResQconnect - Disaster Response & Relief Platform

ResQconnect is a comprehensive platform designed to connect disaster relief teams with communities in need. The platform provides tools for emergency reporting, coordination, and real-time communication during disaster response situations.

## Features

- **Emergency Reporting**: Quick submission of emergency reports with location data
- **Interactive Map**: Real-time visualization of emergency situations
- **Volunteer Chat**: Communication system for volunteers and responders
- **Resource Dashboard**: Overview of available resources and needs
- **Mobile Responsive**: Works seamlessly on all devices

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd resq_connect
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Add image files:
   - Place required images in the `public/images` directory
   - See `public/images/placeholder.txt` for the list of required images

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

- `app/`: Next.js application routes and layouts
- `components/`: Reusable React components
- `lib/`: Utility functions and configuration
- `public/`: Static assets including images
- `scripts/`: Setup and seed scripts

## Design Implementation

The frontend is built based on the ResQconnect website design:
- Modern, clean UI focused on disaster response
- Red and slate as primary colors
- Responsive layout for all devices
- Accessible design principles

### Main Pages

1. **Home**: Introduction and quick access to key features
2. **About**: Information about the organization and team
3. **Projects**: Overview of current relief projects
4. **Live Map**: Interactive map showing emergency locations
5. **Dashboard**: Statistics and analytics
6. **Volunteer Portal**: Communication and coordination center

## Technology Stack

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Maps**: Leaflet
- **Real-time**: Pusher
- **Forms**: React Hook Form + Zod

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
