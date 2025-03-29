import type { NextApiRequest, NextApiResponse } from 'next';
import Pusher from 'pusher';

// Initialize Pusher server client
const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID || '1966574',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || '2dbdd870c0be2550d072',
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET || '59585466a4df49cb76b2',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
  useTLS: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Extract socket_id and channel_name from request body
  const { socket_id, channel_name } = req.body;
  
  // Validate required parameters
  if (!socket_id || !channel_name) {
    return res.status(400).json({ 
      error: 'Missing required parameters',
      received: { socket_id, channel_name }
    });
  }
  
  try {
    // For private channels, you might want to check user authentication here
    // For example, if using Next.js middleware or a session library
    
    // Auth for private channel
    if (channel_name.startsWith('private-')) {
      // You can customize the user data based on the authenticated user
      const auth = pusher.authorizeChannel(socket_id, channel_name, {
        user_id: 'anon', // Should be replaced with actual user ID if authenticated
        user_info: {
          name: 'Anonymous User',
        }
      });
      return res.status(200).json(auth);
    } 
    
    // Auth for presence channel
    if (channel_name.startsWith('presence-')) {
      const auth = pusher.authorizeChannel(socket_id, channel_name, {
        user_id: 'anon', // Should be replaced with actual user ID if authenticated
        user_info: {
          name: 'Anonymous User',
        }
      });
      return res.status(200).json(auth);
    }
    
    // For regular channels, we can still generate auth but it's not usually needed
    const auth = pusher.authorizeChannel(socket_id, channel_name);
    return res.status(200).json(auth);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return res.status(500).json({ 
      error: 'Failed to authorize channel',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 