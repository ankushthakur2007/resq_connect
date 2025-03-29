// Twilio client for sending emergency SMS notifications

/**
 * This module provides utilities for sending SMS notifications via Twilio
 * It's designed to work in a server-side context (API routes or server components)
 */

type TwilioSMSResponse = {
  success: boolean;
  messageId?: string;
  error?: string;
};

/**
 * Send an SMS notification for emergency alerts
 * @param to Phone number to send the SMS to
 * @param message The message content
 * @returns Promise with status and message ID or error
 */
export async function sendEmergencyNotification(
  to: string,
  message: string
): Promise<TwilioSMSResponse> {
  try {
    // Check if Twilio credentials are configured
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.error("Missing Twilio configuration");
      return {
        success: false,
        error: "Twilio configuration is incomplete",
      };
    }

    // Dynamic import to avoid including Twilio in the client bundle
    const twilio = await import("twilio");
    const client = twilio.default(accountSid, authToken);

    // Send the message
    const twilioMessage = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });

    console.log(`Emergency SMS sent to ${to}, SID: ${twilioMessage.sid}`);
    
    return {
      success: true,
      messageId: twilioMessage.sid,
    };
  } catch (error) {
    console.error("Failed to send emergency SMS:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Format an emergency message for SMS
 * @param emergency Emergency data object
 * @returns Formatted SMS message
 */
export function formatEmergencyMessage(emergency: any): string {
  const emergencyType = emergency.emergencyType || emergency.type || "Unknown";
  const location = emergency.location || 
    `Lat: ${emergency.lat}, Lng: ${emergency.lng}`;
  const description = emergency.description || "";
  const time = new Date().toLocaleString();

  return `
🚨 EMERGENCY ALERT: ${emergencyType.toUpperCase()}
📍 Location: ${location}
ℹ️ Details: ${description}
⏰ Reported: ${time}
  `.trim();
} 