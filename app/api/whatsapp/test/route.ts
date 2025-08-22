import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // In production, retrieve these from secure storage
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const targetNumber = process.env.WHATSAPP_TARGET_NUMBER

    if (!accessToken || !phoneNumberId || !targetNumber) {
      return NextResponse.json({ error: "WhatsApp not configured" }, { status: 400 })
    }

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
          body: "🧪 Test message from Gmail-WhatsApp Forwarder\n\nYour configuration is working correctly!",
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("WhatsApp test error:", error)
      return NextResponse.json({ error: "Failed to send test message" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("WhatsApp test error:", error)
    return NextResponse.json({ error: "Failed to send test message" }, { status: 500 })
  }
}
