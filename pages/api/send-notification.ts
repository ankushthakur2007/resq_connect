import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmergencyNotification, formatEmergencyMessage } from '@/lib/twilio';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Extract emergency data and phone number from request
    const { emergency, phoneNumber } = req.body;
    
    // Validate required parameters
    if (!emergency) {
      return res.status(400).json({ error: 'Missing emergency data' });
    }
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Missing phone number' });
    }
    
    // Format the message for SMS
    const message = formatEmergencyMessage(emergency);
    
    // Send the SMS notification
    const result = await sendEmergencyNotification(phoneNumber, message);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        messageId: result.messageId,
        message: 'Emergency notification sent successfully'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to send notification'
      });
    }
  } catch (error) {
    console.error('Error in send-notification API:', error);
    
    return res.status(500).json({
      error: 'Failed to send notification',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 