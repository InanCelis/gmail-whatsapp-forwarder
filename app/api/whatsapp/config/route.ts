import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth-middleware"

const POST = async (request: NextRequest, context: { user: { id: string; email: string } }) => {
  try {
    const { accessToken, phoneNumberId, targetNumber } = await request.json()

    if (!accessToken || !phoneNumberId || !targetNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(targetNumber)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // In production, store these securely in a database associated with user ID
    // For now, we'll validate the configuration by testing the API
    const testResponse = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
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
          body: "WhatsApp configuration test - your Gmail forwarder is ready!",
        },
      }),
    })

    if (!testResponse.ok) {
      const error = await testResponse.text()
      console.error("WhatsApp API error:", error)
      return NextResponse.json({ error: "Invalid WhatsApp configuration" }, { status: 400 })
    }

    // Store configuration securely (in production, encrypt and store in database)
    console.log(`WhatsApp configured for user: ${context.user.email}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("WhatsApp config error:", error)
    return NextResponse.json({ error: "Failed to save WhatsApp configuration" }, { status: 500 })
  }
}

export const handler = withAuth(POST)
