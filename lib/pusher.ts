import Pusher from 'pusher-js'

// Get the Pusher configuration from environment variables
const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || '2dbdd870c0be2550d072'
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2'
const pusherAppId = process.env.NEXT_PUBLIC_PUSHER_APP_ID || '1966574'

// Log Pusher configuration if in browser environment
if (typeof window !== 'undefined') {
  console.log('Initializing Pusher client with:');
  console.log(`- Key: ${pusherKey ? '✓ Set' : '✗ Not set'}`);
  console.log(`- Cluster: ${pusherCluster}`);
}

// Validate Pusher configuration
if (!pusherKey) {
  console.warn('Pusher key is missing. Real-time updates will not work.');
}

// Create Pusher client with error handling
let pusherClient: Pusher;

try {
  pusherClient = new Pusher(pusherKey, {
    cluster: pusherCluster,
    enabledTransports: ['ws', 'wss'],
    // Pusher options for better reliability
    wsHost: `ws-${pusherCluster}.pusher.com`,
    httpHost: `sockjs-${pusherCluster}.pusher.com`,
    forceTLS: true,
    // Auth endpoint for private/presence channels
    authorizer: (channel) => {
      return {
        authorize: (socketId, callback) => {
          fetch('/api/pusher-auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              callback(false, data);
            })
            .catch(error => {
              callback(true, error);
            });
        },
      };
    },
  });
  
  // Add connection event listeners for better debugging
  pusherClient.connection.bind('connected', () => {
    console.log('✅ Connected to Pusher successfully');
  });
  
  pusherClient.connection.bind('error', (err: any) => {
    console.error('❌ Pusher connection error:', err);
  });
} catch (error) {
  console.error('Failed to initialize Pusher client:', error);
  
  // Create a fallback dummy client that won't crash the app
  pusherClient = {
    subscribe: () => ({
      bind: () => {},
      trigger: () => {},
    }),
    // Add other required methods that do nothing
    connection: { bind: () => {} },
    channel: () => ({
      trigger: () => Promise.resolve(),
    }),
  } as unknown as Pusher;
}

export const pusher = pusherClient; 