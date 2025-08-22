import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook is from Google (in production, verify the JWT token)
    const body = await request.json()
    console.log("Gmail webhook received:", body)

    // Decode the Pub/Sub message
    const message = body.message
    if (!message || !message.data) {
      return NextResponse.json({ success: true })
    }

    const data = JSON.parse(Buffer.from(message.data, "base64").toString())
    console.log("Gmail notification data:", data)

    // Get the latest emails using Gmail API
    // In production, retrieve stored OAuth tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    )

    // Set credentials from stored tokens
    // oauth2Client.setCredentials(storedTokens)

    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    // Get recent messages
    const messagesResponse = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults: 10,
    })

    const messages = messagesResponse.data.messages || []

    for (const message of messages) {
      const messageDetails = await gmail.users.messages.get({
        userId: "me",
        id: message.id!,
      })

      const headers = messageDetails.data.payload?.headers || []
      const subject = headers.find((h) => h.name === "Subject")?.value || ""
      const from = headers.find((h) => h.name === "From")?.value || ""

      // Get message body
      let body = ""
      if (messageDetails.data.payload?.body?.data) {
        body = Buffer.from(messageDetails.data.payload.body.data, "base64").toString()
      }

      // Check if this email matches any forwarding rules
      const shouldForward = await checkForwardingRules(subject, from, body)

      if (shouldForward) {
        await forwardToWhatsApp(subject, from, body, shouldForward.template)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Gmail webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function checkForwardingRules(subject: string, from: string, body: string) {
  // In production, retrieve rules from database
  // For demo, we'll check against some example rules
  const rules = [
    {
      subjectFilter: "URGENT",
      template: "URGENT EMAIL RECEIVED:\n\nFrom: {from}\nSubject: {subject}\n\nBody: {body}",
    },
  ]

  for (const rule of rules) {
    if (subject.toLowerCase().includes(rule.subjectFilter.toLowerCase())) {
      return rule
    }
  }

  return null
}

async function forwardToWhatsApp(subject: string, from: string, body: string, template: string) {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const targetNumber = process.env.WHATSAPP_TARGET_NUMBER

    if (!accessToken || !phoneNumberId || !targetNumber) {
      console.error("WhatsApp not configured")
      return
    }

    // Replace template placeholders
    const message = template
      .replace("{subject}", subject)
      .replace("{from}", from)
      .replace("{body}", body.substring(0, 500)) // Limit body length

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: targetNumber,
        type: "text",
        text: {
          body: message,
        },
      }),
    })

    if (response.ok) {
      console.log("Email forwarded to WhatsApp successfully")
    } else {
      console.error("Failed to forward to WhatsApp:", await response.text())
    }
  } catch (error) {
    console.error("WhatsApp forwarding error:", error)
  }
}
