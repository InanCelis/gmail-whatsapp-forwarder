import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "Authorization code not provided" }, { status: 400 })
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getAccessToken(code)
    oauth2Client.setCredentials(tokens)

    // Store tokens securely (in production, use a database)
    // For now, we'll store in environment or session

    // Set up Gmail watch for push notifications
    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    const watchResponse = await gmail.users.watch({
      userId: "me",
      requestBody: {
        topicName: process.env.PUBSUB_TOPIC_NAME,
        labelIds: ["INBOX"],
      },
    })

    console.log("Gmail watch setup:", watchResponse.data)

    // Redirect back to dashboard with success
    return NextResponse.redirect(new URL("/?connected=gmail", request.url))
  } catch (error) {
    console.error("Gmail callback error:", error)
    return NextResponse.redirect(new URL("/?error=gmail_auth", request.url))
  }
}
