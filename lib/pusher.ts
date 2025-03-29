import Pusher from 'pusher-js'

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY || ''
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2'

export const pusher = new Pusher(pusherKey, {
  cluster: pusherCluster,
}) 