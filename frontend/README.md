# ResQconnect Frontend

This is the frontend code for the ResQconnect disaster response and relief platform. It's built with Next.js and uses a modern, responsive design based on the ResQconnect website.

## Design

The frontend is built based on the ResQconnect website design:
- Modern, clean UI focused on disaster response
- Red and slate as primary colors
- Responsive layout for all devices
- Accessible design principles

## Pages

1. **Home**: Introduction to ResQconnect with hero section, mission statement, and relief projects overview
2. **About**: Information about the organization, mission, values, and team
3. **Projects**: Showcases current relief efforts with impact statistics

## Components

The UI is built with reusable components:
- **NavBar**: Responsive navigation with mobile menu
- **Footer**: Site footer with links and contact information
- **Layout**: Wrapper component for consistent page layout

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Add image files:
   - Place required images in the `public/images` directory
   - See `public/images/placeholder.txt` for the list of required images

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Technology Stack

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## Images Required

- **Home Page**:
  - `disaster-background.jpg` - Main hero image showing a disaster scene
  - `gas-mask.jpg` - Emergency responder with gas mask
  - `mission.jpg` - Image representing the organization's mission

- **About Page**:
  - `disaster-team.jpg` - Team responding to a disaster
  - `team-1.jpg` - Team member portrait (Sarah Johnson)
  - `team-2.jpg` - Team member portrait (Michael Rodriguez)
  - `team-3.jpg` - Team member portrait (Aisha Patel)

- **Projects Page**:
  - `projects-hero.jpg` - Hero image for projects section
  - `project-1.jpg` - Emergency Aid Distribution project image
  - `project-2.jpg` - Medical Relief Camp project image
  - `project-3.jpg` - Community Reconstruction project image
  - `project-4.jpg` - Earthquake Response project image 