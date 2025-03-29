import { supabase } from '../lib/supabase'

// Mock data for seeding
const emergencyTypes = ['flood', 'fire', 'earthquake', 'medical', 'other']
const statuses = ['pending', 'in_progress', 'resolved']

// Random number between min and max
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Random item from array
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Generate random latitude/longitude around Manila, Philippines
function randomLocation() {
  // Manila coordinates: approximately 14.5995, 120.9842
  const baseLat = 14.5995
  const baseLng = 120.9842
  
  // Random offset within ~10km
  const latOffset = (Math.random() - 0.5) * 0.1
  const lngOffset = (Math.random() - 0.5) * 0.1
  
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset
  }
}

// Generate a random date within the last week
function randomDate() {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  return new Date(
    oneWeekAgo.getTime() + Math.random() * (now.getTime() - oneWeekAgo.getTime())
  ).toISOString()
}

export async function seedIncidents(count = 50) {
  console.log(`Seeding ${count} incidents...`)
  
  const incidents = []
  
  for (let i = 0; i < count; i++) {
    const location = randomLocation()
    const reportedAt = randomDate()
    
    incidents.push({
      type: randomItem(emergencyTypes),
      status: randomItem(statuses),
      location: `POINT(${location.lng} ${location.lat})`,
      description: `Mock emergency incident #${i + 1}`,
      reported_at: reportedAt
    })
  }
  
  const { data, error } = await supabase
    .from('incidents')
    .insert(incidents)
  
  if (error) {
    console.error('Error seeding incidents:', error)
    return false
  }
  
  console.log(`Successfully seeded ${count} incidents.`)
  return true
}

export async function seedChatMessages(count = 20) {
  console.log(`Seeding ${count} chat messages...`)
  
  const usernames = ['EMT1', 'Firefighter2', 'Volunteer3', 'Coordinator', 'Dispatcher']
  const messageTemplates = [
    'Responding to the incident at location X.',
    'Need more volunteers at the flood site.',
    'Medical supplies required at the earthquake zone.',
    'Roads blocked near the fire incident.',
    'All clear at location Y, moving to next emergency.',
    'Can someone confirm the status of the shelter?',
    'Additional resources dispatched to your location.',
    'Please provide an update on the current situation.'
  ]
  
  const messages = []
  
  for (let i = 0; i < count; i++) {
    const timestamp = randomDate()
    
    messages.push({
      id: `seed-msg-${i + 1}`,
      user: randomItem(usernames),
      text: randomItem(messageTemplates),
      timestamp
    })
  }
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(messages)
  
  if (error) {
    console.error('Error seeding chat messages:', error)
    return false
  }
  
  console.log(`Successfully seeded ${count} chat messages.`)
  return true
}

// Run the seed functions if this file is executed directly
if (require.main === module) {
  (async () => {
    await seedIncidents()
    await seedChatMessages()
    process.exit(0)
  })()
} 